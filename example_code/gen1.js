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
  octave_and_tenth(base=36) {
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
  equals(chord) {
    if( chord.root != this.root ) return false
    const a = JSON.stringify(this.notes)
    const b = JSON.stringify(chord.notes)
    console.log(a,b)
    if( a == b ) return true 
    else return false
  }
  compare(chord) {
    if( this.root < chord.root ) return -1
    if( this.root > chord.root ) return 1
    const m = Math.min(this.notes.length,chord.notes.length)
    for(let i=0;i<m;i++) {
      if( this.notes[i] < chord.notes[i] ) return -1
      if( this.notes[i] > chord.notes[i] ) return 1
    }
    if(this.notes.length < chord.notes.length ) return -1
    if(this.notes.length > chord.notes.length ) return 1
    return 0 // equal roots and equal notes
  }
}

class ChordSet {
  constructor() {
    this.chords = []
  }
  add(chord) {
    if(!this.contains(chord)) {
      console.log("New chord")
      this.chords.push(chord)
      this.chords.sort((x,y) => x.compare(y))
    } else {
      console.log("Chord already present")
    }
  }
  contains(chord) {
    return this.chords.filter(x => x.equals(chord)).length > 0
  }
  remove(chord) {
    if(this.contains(chord)) {
      console.log("Removing chord")
      this.chords = this.chords.filter(x => !x.equals(chord))
    } else {
      console.log("Chord not present so cannot remove")
    }
  }
}

let test = () => {
  console.log("test()")
  const a = new Chord(0,[0,4,7])
  const b = new Chord(0,[0,4,7])
  const c = new Chord(0,[0,3,7])
  const d = new Chord(1,[0,4,7])
  console.log(`Should be true: ${a.equals(b)}`)
  console.log(`Should be false: ${a.equals(c)}`)
  console.log(`Should be false: ${a.equals(d)}`)
}
test()

test = () => {
  cset = new ChordSet()
  cset.add(new Chord(0,[0,4,7]))
  cset.add(new Chord(0,[0,4,7]))
  cset.add(new Chord(0,[0,3,7]))
  cset.add(new Chord(1,[0,4,7]))
  console.log(cset)
  console.log(cset.contains(new Chord(0,[0,4,7])))
  console.log(cset.contains(new Chord(3,[1,2,3])))
  cset.remove(new Chord(0,[0,3,7]))
  console.log(cset)
}
test()

const range = n => Array.from(Array(n).keys())
console.log(range(10))

/*
  Create a list of Chord objects.
  In this case, it is all the major and minor triads.
*/
const create_chords = () => {
  const major_triad = [0,4,7]
  const minor_triad = [0,3,7]
  const chrom_scale = range(12)
  const majors = chrom_scale.map(i => new Chord(i, major_triad))
  const minors = chrom_scale.map(i => new Chord(i, minor_triad))
  return majors.concat(minors)
}

/*
This is functional for here. The reason for writing it like
this is for future factoring. We do not want duplicate
Chord objects.
*/
const chords = create_chords()
const get_chords = () => chords

/*
Create a map of which chords contain a given pitch class
*/
const create_chord_map = () => {
  const chords = get_chords()
  // for each pitch class, we want a list of
  // chords containing that pitch class
  const chord_map = []
  for(let i=0; i<12; i++) { chord_map.push([]) }
  chords.forEach(chord => {
    chord.pitch_classes().forEach(pitch_class => {
      chord_map[pitch_class].push(chord)
    })
  })
  return chord_map
}

/*
As noted above, we don't want to be using global variables
in future versions. This is functional for now. Later we
shall wrap this up in a class or a few classes.
*/
const chord_map = create_chord_map()
const get_chord_map = () => chord_map
console.log(chord_map)

const assign_successors = () => {
  const chords = get_chords()
  const chord_map = get_chord_map()
  // pseudocode
  // for each chord, get the pitch classes in the chord.
  // for each pitch class, get the chords containing it.
  // add the fifth above a chord to the list. ((root+7)%12)
  // remove the original chord from the list.
  //    chord1 === chord2
  // the resulting list is what we want
  chords.forEach(chord => {
    const pitch_classes = chord.pitch_classes()
    const chords_containing_pitches = new ChordSet()
    pitch_classes.forEach(pitch_class => {
      const chords1 = chord_map[pitch_class]
      chords1.forEach(chord1 => chords_containing_pitches.add(chord1))  
    })
    chords_containing_pitches.remove(chord)
    chords_containing_pitches.chords.forEach(chord4 => {
      chord.following_chords.push(chord4)
    })
  })
}
assign_successors()

console.log(chords[0])
// const rng = new Srand()
// seed with 0 for now
// increment seed each time user presses space bar