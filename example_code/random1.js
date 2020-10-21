
class Rng {
  constructor(seed=0) {
    this.modulus = 2**31
    this.multiplier = 1103515245
    this.increment = 12345
    this.mask = 2**31-1
    this.seed(seed)
  }
  seed(seed=0) {
    this.seed = seed
    this.value = seed
    this.rand()
  }
  rand() {
    const { modulus, multiplier, increment, mask } = this
    console.log(this.value, this.value*multiplier, (this.value*multiplier) + increment)
    this.value = ((this.value * this.multiplier) + this.increment) % this.modulus
    return this.value & this.mask
  }
}
// this fails due to using double floats and limited precision

const usage = () => {
  const r = new Rng(42)
  let x = r.rand()
  r.seed(21)
  x = r.rand()
}

// To get random seed, use (Math.random()*2**31)|0
const seed = (Math.random()*2**31)|0
const r = new Rng(seed)
console.log(`Seed: ${seed}`)
for( let i=0; i<5; i++ ) {
  const x = r.rand()
  console.log(`${x} ${x%10} ${x%12} ${x%256}`)
}