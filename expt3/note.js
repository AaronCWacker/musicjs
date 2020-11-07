class Note {
  constructor(midi_pitch=60) {
    // console.log("constructor Note",midi_pitch)
    this.from_midi(midi_pitch)
  }
  from_midi(midi_pitch) {
    // clamp
    if( midi_pitch < 0 ) midi_pitch = 0
    if( midi_pitch > 127 ) midi_pitch = 127
    this.midi_pitch = midi_pitch
  }
  from_abc(abc_pitch) {
    let m
    const d = { "c": 0, "d": 2, "e": 4, "f": 5, "g": 7, "a": 9, "b": 11 }
    if( m = abc_pitch.match(/^([_^]?)([a-gA-G])(,*|'*)$/) ) {
      const { match, accidental, pitch, octave_mod } = m
      let octave, pitch_class
      octave = 5
      pitch_class = d[pitch.toLowerCase()]
      if( pitch.match(/[a-g]/) ) {
        octave += 1
      }
      switch( accidental ) {
        case "_":
          pitch_class -= 1
          if( pitch_class < 0 ) {
            octave -= 1
            pitch_class += 12
          }
          break
        case "^":
          pitch_class += 1
          if( pitch_class > 11 ) {
            octave += 1
            pitch_class -= 12
          }
          break
      }
      if( octave_mod.length > 0) {
        switch( octave_mod[0] ) {
          case "'":
            octave += octave_mod.length
            break
          case ",":
            octave -= octave_mod.length
            break
        }
      }
      this.midi_pitch = 12*octave+pitch_class
      if( this.midi_pitch < 0 ) this.midi_pitch = 0
      if( this.midi_pitch > 127 ) this.midi_pitch = 127
    }
  }
  to_midi_pitch() {
    return this.midi_pitch
  }
  to_abc_pitch(use_sharp = false) {
    const pitch_class = this.midi_pitch % 12
    const octave = Math.floor(this.midi_pitch/12)
    const white_keys = ["C","D","E","F","G","A","B"]
    const white_keys_lookup = {0:"C",2:"D",4:"E",5:"F",7:"G",9:"A",11:"B"}
    const white_keys_midi = [0,2,4,5,7,9,11]
    let octave_mod, abc_pitch, accidental
    // if not in white_keys_midi, if use_sharp
    // then subtract 1, lookup and append sharp
    // else add 1, lookup and append flat
    // console.log({pitch_class})
    if( pitch_class in white_keys_lookup ) {
      abc_pitch = white_keys_lookup[pitch_class]
      accidental = ""
    } else {
      if( use_sharp ) {
        abc_pitch = white_keys_lookup[pitch_class - 1]
        accidental = "^"
      } else {
        abc_pitch = white_keys_lookup[pitch_class + 1]
        accidental = "_"
      }
    }
    // console.log({abc_pitch})
    if( octave <= 5 ) {
      const octave_shift = 5 - octave
      octave_mod = ",".repeat(octave_shift)
    } else {
      abc_pitch = abc_pitch.toLowerCase()
      const octave_shift = octave - 6
      octave_mod = "'".repeat(octave_shift)
    }
    const abc = accidental + abc_pitch + octave_mod
    return abc
  }
}
