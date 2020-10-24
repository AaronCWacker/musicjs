class BlockChordGenerator extends AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    this.chord_generator = new AdjacentChordGenerator(rng)
    const config = {
      clef: "treble",
      octave: 60,
      bars_per_line: 8,
      number_of_bars: 32
    }
    this.config = config
    // console.log("const",config,this.config)

    ui.set_key_handler("1",() => { config.clef="bass";   config.octave = 36; ui.signal_callbacks() })
    ui.set_key_handler("2",() => { config.clef="bass";   config.octave = 40; ui.signal_callbacks() })
    ui.set_key_handler("3",() => { config.clef="bass";   config.octave = 44; ui.signal_callbacks() })
    ui.set_key_handler("4",() => { config.clef="bass";   config.octave = 48; ui.signal_callbacks() })
    ui.set_key_handler("5",() => { config.clef="bass";   config.octave = 52; ui.signal_callbacks() })
    ui.set_key_handler("6",() => { config.clef="treble"; config.octave = 56; ui.signal_callbacks() })
    ui.set_key_handler("7",() => { config.clef="treble"; config.octave = 60; ui.signal_callbacks() })
    ui.set_key_handler("8",() => { config.clef="treble"; config.octave = 64; ui.signal_callbacks() })
    ui.set_key_handler("9",() => { config.clef="treble"; config.octave = 68; ui.signal_callbacks() })
    ui.set_key_handler("0",() => { config.clef="treble"; config.octave = 72; ui.signal_callbacks() })
  }
  generate_abc() {
    // console.log("generate_abc",this,this.config)
    const break_every = this.config.bars_per_line
    const gen = this.chord_generator

    gen.reset() 

    const arr = gen.generate(this.config.number_of_bars) 
    const use_sharps = ui.use_sharps
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
