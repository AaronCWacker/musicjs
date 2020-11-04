// logic to generate random music goes here
class MyGenerator extends AbcGenerator {
  constructor(rng,ui,paper) {
    super(rng,ui,paper)
    console.log("my constructor")
  }
  generate_abc() {
    const pitches = ['A','B','C','D','E','F','G']
    const ar = []
    for(let i=0; i<10; i++) {
      ar.push(this.rng.rand_choice(pitches))
    }
    const ab = ar.join("")
    const sample_abc = `
X:1
M:12/8
L:1/8
K:clef=treble
CCCC CCCC|DDDD DEFG|
${ab}|]      
   `
    return sample_abc
  }
}

