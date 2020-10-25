// root 5th octave 10th quaver 12/8 pattern (White clouds) 
class Pattern1aAbcGenerator extends Pattern1AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    this.config.time_signature = "4/4"
    this.config.default_note_duration = "1"
    this.config.bars_per_line = 8,
    this.config.number_of_bars = 32
  }
  root_note_to_bar(root_index,all_notes) {
    const pattern = [0,4,7,9]
    const pitches_indices = pattern.map(x => x + root_index)
    const pitches = pitches_indices.map(x => all_notes[x])
    const notes = pitches.map(midi_pitch => new Note(midi_pitch))
    const abc_pitches = notes.map(note => note.to_abc_pitch(this.ui.use_sharps))
    // do each pattern twice, for a total of 12 notes, grouped in 6's
    const abc1 = "["+abc_pitches.join("")+"]"
    const abc = `${abc1} `
    return abc
  }
}