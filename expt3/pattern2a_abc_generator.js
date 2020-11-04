// root fifth third fifth
class Pattern2aAbcGenerator extends Pattern2AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    this.config.time_signature = "3/4"
    this.config.default_note_duration = "1/8"
    this.config.bars_per_line = 4,
    this.config.number_of_bars = 16
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
  notes_to_bar(notes) {
    notes.sort((x,y) => x-y)
    const pattern = [0,1,2,1,2,1]
    const pitches = pattern.map(x => notes[x])
    const notes1 = pitches.map(midi_pitch => new Note(midi_pitch))
    const abc_pitches = notes1.map(note => note.to_abc_pitch(this.ui.use_sharps))
    // do each pattern twice, for a total of 12 notes, grouped in 6's
    const abc1 = abc_pitches.join("")
    const abc = `${abc1}`
    return abc
  }
}