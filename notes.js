/* global m */

const NOTESURL = 'http://localhost:3000/notes'

const Notes = {
  mynotes: [],
  expandeds: [],
  fetchNotes() {
    console.log('In fetchNotes()... About to make request()');
    m.request({method: 'get', url: NOTESURL}).then(
        (data) => {
          Notes.mynotes = data
          for (let i = 0, n = Notes.mynotes.length; i < n; i++) {
            Notes.expandeds[i] = 0
          }
          console.log(JSON.stringify(data));
        },
        (error) => {
          console.log('Error fetching notes.' + error);
        })
  }
}

const Editor = {
  saveEditor(idx) {
    return function () {
      Notes.expandeds[idx] = 0;
      console.log(Notes.mynotes)
    }
  },
  view(vnode) {
    return m('div', {class: 'pad-bot-1em'}, [
      m('textarea', {
            value: vnode.attrs.note.text,
            rows: 6, cols: 80,
            class: 'pad8px',
            autofocus: true
        }),
      m('br'),
      vnode.attrs.note.tags.map(tag => {
        return [
          m('.label .label-info ', tag),
          m.trust(' &nbsp; &nbsp; ')
        ]
      }),
      m('button', {onclick: Editor.saveEditor(vnode.attrs.i)}, ' OK ')
    ])
  }
}

const PostView = {
  noteExpansion(postIndex) {
    return function() {
      Notes.expandeds[postIndex] = (Notes.expandeds[postIndex] === 0) ? 1 : 0
    }
  },
  view(vnode) {
    // console.log('vnode.attrs.i', vnode.attrs.i);
    if (Notes.expandeds[vnode.attrs.i]) {
      return m(Editor, {note: vnode.attrs.note, i: vnode.attrs.i})
    }
    return m('.panel .panel-default',
      m('.panel-heading',
        m('span',
            {onclick: PostView.noteExpansion(vnode.attrs.i)},
            vnode.attrs.note.title), [
              m.trust(' &nbsp; '),
              m('span.glyphicon.glyphicon-flash', {'aria-hidden': 'true'})
            ]),
      m('.panel-body', [
        m('span', vnode.attrs.note.text),
        m('div', {style: 'padding-top:0.5em'},
          vnode.attrs.note.tags.map((tag) => {
            return m('span', [
              m('.label label-info', tag),
              m.trust(' &nbsp; ')
            ])
          }) // tag entries.
        )
      ]) // panel body
    )
  }
}

const NotesComponent = {
  oninit: Notes.fetchNotes,
  view() {
    return m('.notes', [
      m('h2', 'My notes'),
        Notes.mynotes.map((note, i) => {
          return m(PostView, {note, i})
        }) // map items.
      ] // .children of .notes
    ) // .notes
  }
}

/**
 * Greeting Mithril Component.
 */
/* eslint-disable */
const Greeting = {
  view() {
    return m('.greeting', [
      m('h3', 'The vap notes'),
      m('p', `Here I expect to show several of my notes.`),
      m('p', `There'll be a large series of them, let's see how it goes...`)
    ])
  }
}

// m.render(document.querySelector('#app'),
//          m('h3', 'Hello, these are my notes.'))

m.mount(document.querySelector('#app'), NotesComponent)