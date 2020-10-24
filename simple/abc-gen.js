class AbcGenerator {
  constructor(rng,ui,paper) {
    console.log("abc constructor")
    this.rng = rng
    this.ui = ui
    this.paper = paper
    this.ui.add_callback(this.generate)
    this.generate()
  }
  generate = () => {
    // leave this method alone in subclasses
    this.rng.reset()
    const abc = this.generate_abc()
    ABCJS.renderAbc(this.paper,abc,{responsive:"resize"})
  }
  generate_abc() {
    // override this method in subclasses
    const sample_abc = `
X:1
M:12/8
L:1/8
K:clef=bass
CCCC CCCC|DDDD DEFG|]      
    `
    return sample_abc
  }
}
