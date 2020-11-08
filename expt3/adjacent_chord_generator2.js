class AdjacentChordGenerator2 {
  constructor(rng) {
    // console.log("AdjancendChordGenerator constructor")
    this.rng = rng
    const indices = this.range(12)
    const major_chord_notes = [0,4,7]
    const minor_chord_notes = [0,3,7]
    const sus_chord_notes = [0,2,7]
    const sev_chord_notes = [0,4,10]
    const msev_chord_notes = [0,3,10]
    const major_chords = indices.map(root => new Chord(root,major_chord_notes,"major"))
    const minor_chords = indices.map(root => new Chord(root,minor_chord_notes,"minor"))
    const sus_chords = indices.map(root => new Chord(root,sus_chord_notes,"sus2"))
    const sev_chords = indices.map(root => new Chord(root,sev_chord_notes,"7"))
    const msev_chords = indices.map(root => new Chord(root,msev_chord_notes,"m7"))
    const chords_containing_note = indices.map(_ => Array())
    major_chords.forEach(chord => {
      chord.abs_notes.forEach(note => {
        chords_containing_note[note].push(chord)
      })
    })
    minor_chords.forEach(chord => {
      chord.abs_notes.forEach(note => {
        chords_containing_note[note].push(chord)
      })
    })
    sus_chords.forEach(chord => {
      chord.abs_notes.forEach(note => {
        chords_containing_note[note].push(chord)
      })
    })
    sev_chords.forEach(chord => {
      chord.abs_notes.forEach(note => {
        chords_containing_note[note].push(chord)
      })
    })
    msev_chords.forEach(chord => {
      chord.abs_notes.forEach(note => {
        chords_containing_note[note].push(chord)
      })
    })
    this.chords_containing_note = chords_containing_note
    this.reset()
  }
  reset() {
    // console.log("Adj reset")
    this.rng.reset()
    const candidates = this.rng.rand_choice(this.chords_containing_note)
    // console.log("candidates",{candidates})
    this.current_chord = this.rng.rand_choice(candidates)
    // this.current_chord.print()
  }
  next() {
    // console.log("next")
    const new_pivot = this.rng.rand_choice(this.current_chord.abs_notes)
    const candidates = this.chords_containing_note[new_pivot].filter(
      chord => !this.current_chord.same_notes_as(chord)
    )
    // console.log("candidates length",candidates.length)
    // console.log("candidates",{candidates})
    const new_chord = this.rng.rand_choice(candidates)
    // new_chord.print()
    this.current_chord = new_chord
    return new_chord
  }
  range(n) {
    return Array.from(Array(n).keys())
  }
  // seeding isn't working yet
  generate(n) {
    const arr = []
    for(let i=0; i<n; i++) {
      arr.push(this.next())
    }
    return arr
  }
  test(n) {
    // console.log("test",n)
    this.reset()
    const arr = this.generate(10)
    // console.log("Got array",arr)
    // console.log("print chords in test()")
    // arr.forEach(chord => chord.print())
    arr.forEach(chord => {
      const notes_pitches = chord.notes_in_octave(60)
      const notes_objects = notes_pitches.map(x => new Note(x))
      const notes_abc = notes_objects.map(x => x.to_abc_pitch(false))
      console.log(notes_abc)
    })
  }
}