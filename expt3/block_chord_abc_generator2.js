class BlockChordGenerator2 extends AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    this.chord_generator = new AdjacentChordGenerator2(rng)
    const config = {
      clef: "treble",
      octave: 60,
      bars_per_line: 8,
      number_of_bars: 64
    }
    this.config = config
    // console.log("const",config,this.config)

    this.note_ranges = [
      { clef: "bass", octave: 36 },
      { clef: "bass", octave: 40 },
      { clef: "bass", octave: 44 },
      { clef: "bass", octave: 48 },
      { clef: "bass", octave: 52 },
      { clef: "treble", octave: 56 },
      { clef: "treble", octave: 60 },
      { clef: "treble", octave: 64 },
      { clef: "treble", octave: 68 },
      { clef: "treble", octave: 72 }
    ]
    this.note_range = 0
    ui.set_key_handler("1",() => { this.set_note_range(0) })
    ui.set_key_handler("2",() => { this.set_note_range(1) })
    ui.set_key_handler("3",() => { this.set_note_range(2) })
    ui.set_key_handler("4",() => { this.set_note_range(3) })
    ui.set_key_handler("5",() => { this.set_note_range(4) })
    ui.set_key_handler("6",() => { this.set_note_range(5) })
    ui.set_key_handler("7",() => { this.set_note_range(6) })
    ui.set_key_handler("8",() => { this.set_note_range(7) })
    ui.set_key_handler("9",() => { this.set_note_range(8) })
    ui.set_key_handler("0",() => { this.set_note_range(9) })
    ui.append_button("ui_range_plus","range-","range_control",(e) => this.dec_note_range(e))
    ui.append_button("ui_range_minus","range+","range_control",(e) => this.inc_note_range(e))
  }
  set_note_range(i) {
    this.note_range = i
    this.config.clef = this.note_ranges[i].clef
    this.config.octave = this.note_ranges[i].octave
    ui.note_range_span.textContent = ""+((i+1)%10)
    ui.signal_callbacks()
  }
  inc_note_range() {
    if( this.note_range+1 < this.note_ranges.length) {
      this.set_note_range(this.note_range+1)
    }
  }
  dec_note_range() {
    if( this.note_range > 0 ) {
      this.set_note_range(this.note_range-1)
    }
  }
  generate_abc() {
    // console.log("generate_abc",this,this.config)
    const break_every = this.config.bars_per_line
    const gen = this.chord_generator

    gen.reset() 

    const arr = gen.generate(this.config.number_of_bars) 
    const use_sharps = this.ui.use_sharps
    const arr_abc = arr.map(chord => chord.notes_in_octave(this.config.octave))
      .map(midi_notes => midi_notes.map(midi_note => new Note(midi_note)))
      .map(notes => notes.map(note => note.to_abc_pitch(use_sharps)))

    let abc = `M:4/4\nL:1/1\nK: clef=${this.config.clef}\n[| `
    for(let i=0; i<arr_abc.length; i++) {
      let ys = arr_abc[i]
      abc += `[${ys.join("")}]`
      if( i+1 < arr_abc.length ) {
        abc += " | "
        if( (i%break_every) == (break_every-1)) {
          abc += "\n"
        }
      } else {
        abc += " |]"
      }
    }
    return abc
  }
}
