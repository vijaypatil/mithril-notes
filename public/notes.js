/* global m, Noty */

const NOTESURL = 'http://localhost:3000/notes/'

/**
 * Each `note` element is updated with a .stag property.
 * stag is a comma-separated string value of .tags array.
 * .tag -> ["one", "two", "three"] => "one, two, three"
 * @param {[Note]} notes
 */
const updateAllStags = (notes) => {
  const res = []
  notes.forEach((note) => {
    const notetags = []
    if (note.tags) {
      console.log(note.tags);
      note.tags.forEach((tag) => {
        const xtag = tag.trim()
        if (xtag.length > 0) {
          if (res.indexOf(xtag) < 0) {
            res.push(xtag)
          }
          notetags.push(xtag)
        }
      })
    }
    note.stags = notetags.join(', ')
    console.log('notes.stags: ', note.stags)
  })
  return res
}

const tagsToString = (tags) => {
  const res = []
  tags.forEach((tag) => {
    const xtag = tag.trim()
    if (xtag.length > 0) {
      res.push(xtag)
    }
  })
  return res.join(', ')
}

/**
 * Converts: "one, two, three" to ["one", "three", "two"]
 * The tags are in sorted order.
 * @param {[String]} res - String Array, from comma-separated of notesRec.stags string.
 */
const tagsToArray = (notesRec) => {
  let res = []
  if (notesRec.stags) {
    res = notesRec.stags.split(',').map((tag) => (tag.trim())).filter(tag => (tag.length > 0))
    console.log('res: ', res);
    res.sort()
  }
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
            Notes.mynotes[i].tags.sort()
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
      Notes.rec.tags = tagsToArray(Notes.rec)
      Notes.rec.created = new Date().toString()
      const newrec = Object.assign({}, Notes.rec)
      delete newrec.stags
      Notes.mynotes[idx] = Notes.rec

      m.request({
        method: 'put',
        url: NOTESURL + Notes.mynotes[idx].id,
        data: newrec
      }).then((result) => {
        // $.notify('Post saved', 'success')
        new Noty({
          text: 'Saved post',
          timeout: 4000,
          theme: 'mint'
        }).show()
        Notes.mynotes[idx] = Notes.rec
        Notes.rec.stags = ''
        console.log(JSON.stringify(result))
      })
      Notes.expandeds[idx] = 0
      // console.log(Notes.mynotes)
    }
  },
  cancelEditor(idx) {
    return () => {
      Notes.expandeds[idx] = 0
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
      m('input[type=text][placeholder=tags, comma separated].col-md-3', {
          style: 'padding: 6px; border-radius: 6px',
          oninput: m.withAttr('value', Notes.setsTags),
          value: Notes.rec.stags
        }),
      m.trust(' &nbsp; &nbsp; '),
      m('button.btn btn-sm btn-danger', {onclick: Editor.saveEditor(vnode.attrs.i)}, ' OK '),
      m.trust(' &nbsp; &nbsp; '),
      m('button.btn btn-sm btn-warning', {onclick: Editor.cancelEditor(vnode.attrs.i)}, ' Cancel ')
    ])
  }
}

// Indicate that we are clickable/selectable
const darkBackground = (e) => {
  e.target.style.background = 'silver' // #c0c0c0' // silver.
}

// Indicate that we are clickable/selectable
const lightBackground = (e) => {
  e.target.style.background = 'lightgray'
}

const PostView = {
  noteExpansion(postIndex) {
    return function() {
      Notes.expandeds[postIndex] = (Notes.expandeds[postIndex] === 0) ? 1 : 0
      if (Notes.expandeds[postIndex] === 1) {
        Notes.rec = Object.assign({}, Notes.mynotes[postIndex])
        Notes.rec.stags = tagsToString(Notes.rec.tags)
      }
    }
  },
  view(vnode) {
    //=> Display Editor for the Note.
    if (Notes.expandeds[vnode.attrs.i]) {
      return m(Editor, {note: vnode.attrs.note, i: vnode.attrs.i})
    }
    // Display Note in a panel.
    return m('.panel .panel-default',
      m('.panel-heading', {
        onclick: PostView.noteExpansion(vnode.attrs.i),
        onmouseenter: darkBackground,
        onmouseleave: lightBackground
      },
        m('span',
            vnode.attrs.note.title,
            m('span.pull-right', [
              m('span', vnode.attrs.note.created),
              // m.trust(' &nbsp; &nbsp; ')
              // m('span.glyphicon.glyphicon-flash', {'aria-hidden': 'true'})
            ])
          )),
      m('.panel-body', [
        m('span', {style: 'white-space: pre-line;'}, vnode.attrs.note.text),
        m('div', {style: 'padding-top:0.5em'},
          (vnode.attrs.note.tags) ? // this note has tags!
              vnode.attrs.note.tags.map((tag) => (
                      m('span', [
                        m('.label label-info', tag),
                        m.trust(' &nbsp; ')
                      ])
                  )) : // no tags in this note. Mithril is happy with null
              null
        )
      ])
    )
  }
}

const NotesComponent = {
  oninit: Notes.fetchNotes,
  view() {
    return m('.notes', [
      m('h3', 'Tech Journal'),
        (Notes.mynotes.length === 0)
          ? m('.well well-lg', 'There are no Notes in your Journal, yet.')
          : Notes.mynotes.map((note, i) => (m(PostView, {note, i})))
      ]
    )
  }
}
m.mount(document.querySelector('#app'), NotesComponent)
