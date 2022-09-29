describe('sum()', () => {
  function sum(n1: number, n2: number): number {
    return n1 + n2
  }

  it('should return two', () => {
    expect(sum(1, 1)).toBe(2)
  })

  it('should return 6', () => {
    expect(sum(10, -4)).toBe(6)
  })
})
