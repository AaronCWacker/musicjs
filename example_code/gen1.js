// Chord generator
// Generates chord objects
// Chord has root pitch class in range 0..11
// Chord has notes pitch classes in range 0.23 (3 of for a triad)
class Chord {
  constructor(root=0,notes=[0,4,7]) {
    this.root = root % 12
    this.notes = notes
    this.following_chords = [] // possible successors
    // for this we want either the fifth above, or
    // on of the major/minor triads with one of 
    // the notes from this chord in it.
  }
  pitch_classes() {
    return this.notes.map(i => ((this.root + i)%12))
  }
  octave_and_tenth(base=37) {
    // 0, 7, 12, 15/16, 12, 7
    // notes[0], notes[2], notes[0]+12, notes[1]+12, notes[0]+12,notes[1]
    
    const root = this.get_root_above(base)
    const notes = this.notes
    const sequence = [
      notes[0], notes[2], notes[0]+12, 
      notes[1]+12, notes[0]+12,notes[1]]
    return sequence.map(x => x + root)
  }
  get_root_above(base=36) {
    // e.g. base 37:
    // c = 0 goes to 37 + 11
    // 37 mod 12 = 1
    // 12 - 1 = 11
    // base + 11

    // c# = 1 goes to 37
    // 37 % 12 = 1
    // 12 - 1 = 11
    // 1 + 11 % 12 = 0
    // base + 0

    // d = 2 goes to 38
    // 37 % 12 = 1
    // 12 - 1 = 11
    // (2 + 11) % 12 = 1
    // base + 1 = 38
    const a = base % 12
    const b = 12 - a
    const c = (this.root + b) % 12
    return base + c
  }
}

const range = n => Array.from(Array(n).keys())
const createChords = () => {
  const major_triad = [0,4,7]
  const minor_triad = [0,3,7]
  const chrom_scale = range(12)
  const majors = chrom_scale.map(i => new Chord(i, major_triad))
  const minors = chrom_scale.map(i => new Chord(i, minor_triad))
  return majors.concat(minors)
}
const create_chord_ap = () => {
  const chords = createChords()
  // for each pitch class, we want a list of
  // chords containing that pitch class
  const chord_map = []
  for(let i=0; i<12; i++) { chordMap.push([]) }
  chords.forEach(chord => {
    chord.pitch_classes().forEach(pitch_class => {
      chord_map[pitch_class].push(chord)
    })
  })
  return chord_map
}
const assignSuccessors = () => {
  const chord_map = create_chord_map()
}



class ChordMap {
  constructor() {
    // construct the chord map here
  }
  get_chords_containing_note

}
// cs has no notion of root note

const rng = new Srand()
// seed with 0 for now
// increment seed each time user presses space bar