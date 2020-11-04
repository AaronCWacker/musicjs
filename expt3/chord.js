class Chord {
  constructor(root,rel_notes,comment=undefined) {
    this.root = root
    this.rel_notes = rel_notes
    this.comment=comment
    this.abs_notes = this.rel_notes.map((note) => ((note+this.root)%12))
    this.abs_notes.sort((x,y) => x-y)
    this.rel_notes.sort((x,y) => x-y)
    this.note_names = "C C# D D# E F F# G G# A A# B".split(" ")
  }
  print() {
    console.trace(`${this.note_names[this.root]} ${this.comment}`)
  }
  same_notes_as(chord) {
    // compare this.abs_notes
    if( this.abs_notes.length != chord.abs_notes.length ) return false
    for(let i=0; i<this.abs_notes.length; i++) {
      if( this.abs_notes[i] != chord.abs_notes[i] ) return false
    }
    return true
  }
  equals(chord) {
    return this.same_notes_as(chord) && this.root == chord.root
  }
  offset(rel) {
    const chord = new Chord((this.root+rel)%12,this.rel_notes)
  }
  array_offset(arr,offset) {
    return arr.map(x => x + offset)
  } 
  range(n) {
    return Array.from(Array(n).keys())
  }
  notes_in_octave(base) {
    // generate pitch classes translated
    const all_notes = this.range(11).map(x => this.array_offset(this.abs_notes,12*x)).reduce((acc,val) => acc.concat(val))
    return all_notes.filter(note => note >= base && note < base+12)
  }
}
