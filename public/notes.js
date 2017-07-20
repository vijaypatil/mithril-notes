/* global m, R */

const NOTESURL = 'http://localhost:3000/notes'

/**
 * Each `note` element is updated with a .stag property.
 * stag is a comma-separated string value of .tags array.
 *
 * @param {*[Note]} notes
 */
const updateAllStags = (notes) => {
  const res = []
  notes.forEach((note) => {
    const notetags = []
    if (note.tags) {
      note.tags.forEach((tag) => {
        if (res.indexOf(tag) < 0) {
          res.push(tag)
          notetags.push(tag)
        }
      })
    }
    note.stags = notetags.join(', ')
  })
  return res
}

const tagsToArray = (notesRec) => {
  // console.log('notesRec ' + JSON.stringify(notesRec));
  let res = []
  if (notesRec.stags) {
    res = notesRec.stags.split(',').map((tag) => (tag.trim()))
  }
  // console.log(JSON.stringify(notesRec));
  return res
}

const Notes = {
  mynotes: [],
  expandeds: [],
  tags: [],
  rec: {},

  //=> Editor updates.
  setTitle: (v) => {Notes.rec.title = v},
  setPost: (v) => {Notes.rec.text = v},
  setsTags: (v) => {Notes.rec.stags = v},
  setTags: (v) => {Notes.rec.tags = v.split(',').map((tag) => tag.trim())},

  //=> Fetch from backend.
  fetchNotes() {
    m.request({method: 'get', url: NOTESURL}).then(
        (data) => {
          Notes.mynotes = data
          for (let i = 0, n = Notes.mynotes.length; i < n; i++) {
            Notes.expandeds[i] = 0
          }
          updateAllStags(Notes.mynotes)
        },
        (error) => {
          console.log('Error fetching notes.' + error);
        })
  }
}

const Editor = {
  saveEditor(idx) {
    return function () {
      Notes.rec.tags = tagsToArray(Notes.rec) // Notes.setTags(Notes.rec.stags)
      delete Notes.rec.stags
      Notes.mynotes[idx] = Notes.rec
      m.request({
        method: 'put',
        url: NOTESURL + '/' + Notes.mynotes[idx].id,
        data: Notes.rec
      }).then((result) => {
        Notes.mynotes[idx] = Notes.rec
        // console.log(JSON.stringify(result))
      })
      Notes.expandeds[idx] = 0;
      // console.log(Notes.mynotes)
    }
  },
  view(vnode) {
    return m('div', {class: 'pad-bot-1em'}, [
      m('input[type=text][placeholder="A short title for the note"]', {
          style: 'padding: 6px; border-radius: 6px; width: 100%; margin-bottom: 0.25em',
          oninput: m.withAttr('value', Notes.setTitle),
          value: Notes.rec.title
        }),
      m('textarea', {
            oninput: m.withAttr('value', Notes.setPost),
            value: Notes.rec.text,
            class: 'styled-textarea',
            placeholder: 'Your note text. Sometime in the future this could be Markdown',
            autofocus: true
        }),
      m('br'),
      m('input[type=text][placeholder=tags, comma separated]', {
          style: 'padding: 6px; border-radius: 6px',
          oninput: m.withAttr('value', Notes.setsTags),
          value: Notes.rec.stags
        }),
      m.trust(' &nbsp; &nbsp; '),
      m('button.btn btn-sm btn-danger', {onclick: Editor.saveEditor(vnode.attrs.i)}, ' OK ')
    ])
  }
}

const PostView = {
  noteExpansion(postIndex) {
    return function() {
      Notes.expandeds[postIndex] = (Notes.expandeds[postIndex] === 0) ? 1 : 0
      if (Notes.expandeds[postIndex] === 1) {
        Notes.rec = Object.assign({}, Notes.mynotes[postIndex])
      }
    }
  },
  view(vnode) {
    //=> Display the Editor.
    if (Notes.expandeds[vnode.attrs.i]) {
      return m(Editor, {note: vnode.attrs.note, i: vnode.attrs.i})
    }
    // Display the Note in a panel.
    return m('.panel .panel-default',
      m('.panel-heading', {onclick: PostView.noteExpansion(vnode.attrs.i)},
        m('span',
            vnode.attrs.note.title,
            [m('span.glyphicon.glyphicon-flash.pull-right', {'aria-hidden': 'true'})])),
      m('.panel-body', [
        m('span', {style: 'white-space: pre-line;'}, vnode.attrs.note.text),
        m('div', {style: 'padding-top:0.5em'},
          (vnode.attrs.note.tags)
            ? vnode.attrs.note.tags.map((tag) => {
                return m('span', [
                  m('.label label-info', tag),
                  m.trust(' &nbsp; ')
                ])
              })
            : null// tag entries.
        )
      ]) // panel body
    )
  }
}

const NotesComponent = {
  oninit: Notes.fetchNotes,
  view() {
    return m('.notes', [
      m('h2', 'Notes'),
        Notes.mynotes.map((note, i) => {
          return m(PostView, {note, i})
        })
      ]
    )
  }
}
m.mount(document.querySelector('#app'), NotesComponent)
