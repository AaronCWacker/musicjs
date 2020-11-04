// root 5th octave 10th quaver 12/8 pattern (White clouds) 
class Pattern1AbcGenerator extends AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    const config = {
      time_signature: "12/8",
      default_note_duration: "1/8",
      clef: "bass",
      octave: 36,
      number_of_bars: 16,
      bars_per_line: 2
    }
    this.config = config
    this.key_handler_config = [
      { key: "1", clef: "bass", octave: 36 },
      { key: "2", clef: "bass", octave: 40 },
      { key: "3", clef: "bass", octave: 44 },
      { key: "4", clef: "treble", octave: 48 },
      { key: "5", clef: "treble", octave: 52 },
      { key: "6", clef: "treble", octave: 56 },
      { key: "7", clef: "treble", octave: 60 },
      { key: "8", clef: "treble", octave: 64 },
      { key: "9", clef: "treble", octave: 68 },
      { key: "0", clef: "treble", octave: 72 }
    ]
  }
  set_key_handlers() {
    const { ui, config } = this
    this.key_handler_config.forEach(({key,clef,octave}) => {
      ui.set_key_handler(key,() => { config.clef = clef; config.octave = octave; ui.signal_callbacks() })
    })
    this.key_handlers_set = true
  }
  generate_abc() {
    // generates abc
    if(!this.key_handlers_set) {
      this.set_key_handlers()
      this.key_handlers_set = true
    }
    const scale = [0,2,4,5,7,9,11]
    const admissible_roots = [0,2,4,5,7,9]
    const key = this.rng.rand_range(12)
    const scale_in_key = scale.map(x => ((x + key) % 12))
    const admissible_roots_in_key = admissible_roots.map(x => ((x + key) % 12))
    admissible_roots_in_key.sort((x,y) => x-y)
    scale_in_key.sort((x,y) => x-y)
    const offset_array = (arr,offset) => arr.map(x => x+offset)
    const offset_array_mod = (arr,offset,mod) => arr.map(x => ((x+offset)%mod))
    const range = (n) => Array.from(Array(n).keys())
    const all_notes = range(11).map(x => offset_array(scale_in_key,12*x)).reduce((acc,val) => acc.concat(val))
    const all_roots = range(11).map(x => offset_array(admissible_roots_in_key,12*x)).reduce((acc,val) => acc.concat(val))
    const min_root = this.config.octave
    const max_root = min_root + 12

    // possible_roots_pitch_class is in the range [0,12)
    const possible_roots_pitch_classes = offset_array_mod(admissible_roots,key,12)  
    // we want it in the range [min_root,min_root+12)
    const possible_roots = possible_roots_pitch_classes.map(
      pitch_class => {
        let x = pitch_class
        while(x <= min_root) x += 12
        return x
      }
    )
    //all_roots.filter(x => x >= min_root && x < max_root)
    const number_of_bars = this.config.number_of_bars
    const indices = range(number_of_bars)
    const random_roots = []
    let last_root = -1
    let new_root
    for(let i=0; i<number_of_bars; i++) {
      do {
        new_root = this.rng.rand_choice(possible_roots)
      } while( new_root == last_root )
      last_root = new_root
      random_roots.push(new_root)
    }
    const random_root_indices = random_roots.map(x => all_notes.indexOf(x))
    const bars_notes = random_root_indices.map(root_index => this.root_note_to_bar(root_index,all_notes))
    const lines = []
    let line = []
    const header = `X:1
M: ${this.config.time_signature}
L: ${this.config.default_note_duration}
K: clef=${this.config.clef}`

    // breaks up notes into arrays of arrays, each array containing bars on a single line
    const bars_per_line = this.config.bars_per_line
    for(let i=0; i<bars_notes.length; i++) {
      if(i%bars_per_line == 0) {
        if(line.length > 0) lines.push(line)
        line = []
      }
      line.push(bars_notes[i])
    }
    if(line.length > 0) lines.push(line) // handle last line

    // compile text of abc notation
    let t = ""
    lines.forEach(line => {
      line.forEach(bar => {
        t += bar + "|"
      })
      t += "\n"
    })
    let abc = header + "\n" + t
    // console.log(abc)
    return abc
  }
  root_note_to_bar(root_index,all_notes) {
    const pattern = [0,4,7,9,7,4]
    const pitches_indices = pattern.map(x => x + root_index)
    const pitches = pitches_indices.map(x => all_notes[x])
    const notes = pitches.map(midi_pitch => new Note(midi_pitch))
    const abc_pitches = notes.map(note => note.to_abc_pitch(this.ui.use_sharps))
    // do each pattern twice, for a total of 12 notes, grouped in 6's
    const abc1 = abc_pitches.join("")
    const abc = `${abc1} ${abc1}`
    return abc
  }
}