// 1 3 2 3 with voice leading
// generate three pitches in an octave,
// pass the result to the abc generator
// with voice leading
class RowAbcGenerator extends AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    const config = {
      time_signature: "4/4",
      default_note_duration: "1",
      clef: "bass",
      octave: 36,
      number_of_bars: 12,
      bars_per_line: 12
    }
    this.config = config
    this.key_handler_config = [
      { key: "1", clef: "bass", octave: 36 },
      { key: "2", clef: "bass", octave: 40 },
      { key: "3", clef: "bass", octave: 44 },
      { key: "4", clef: "bass", octave: 48 },
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
    const offset_array = (arr,offset) => arr.map(x => x+offset)
    const offset_array_mod = (arr,offset,mod) => arr.map(x => ((x+offset)%mod))
    const range = (n) => Array.from(Array(n).keys())
    const chrom_scale = range(12)
    chrom_scale.sort((x,y) => this.rng.rand_range(2)-0.5)
    const min_root = this.config.octave
    const max_root = min_root + 12
    const notes_in_octave = chrom_scale.map(
      pitch_class => {
        let x = pitch_class
        while(x <= min_root) x += 12
        return x
      }
    )
    const notes_objects = notes_in_octave.map(note => new Note(note))
    const abc_pitches = notes_objects.map(note => note.to_abc_pitch(this.config.use_sharps))
    const lines = []
    let line = []
    const header = `X:1
M: ${this.config.time_signature}
L: ${this.config.default_note_duration}
K: clef=${this.config.clef}`

    // breaks up notes into arrays of arrays, each array containing bars on a single line
    const bars_per_line = this.config.bars_per_line
    for(let i=0; i<abc_pitches.length; i++) {
      if(i%bars_per_line == 0) {
        if(line.length > 0) lines.push(line)
        line = []
      }
      line.push(abc_pitches[i])
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
}
