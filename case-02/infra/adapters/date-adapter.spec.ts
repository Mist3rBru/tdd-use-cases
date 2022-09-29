import { DateAdapter } from './date-adapter'
import { faker } from '@faker-js/faker'

describe('DateAdapter', () => {
  describe('toLocaleDateString()', () => {
    it('should return locale date string formatted', () => {
      const sut = new DateAdapter()

      const date = faker.date.future()
      const expected = date.toLocaleDateString('pt-BR').replace(/\//g, '-')

      const result = sut.toLocaleDateString(date)
      expect(result).toBe(expected)
    })

    it('should return the same date if it is already formatted', () => {
      const sut = new DateAdapter()

      const date = faker.date.future()
      const expected = date.toLocaleDateString('pt-BR').replace(/\//g, '-')

      const result = sut.toLocaleDateString(expected)
      expect(result).toBe(expected)
    })
  })

  describe('toLocaleTimeString()', () => {
    it('should return locale time string formatted', () => {
      const sut = new DateAdapter()

      const date = faker.date.future()
      const expected = date.toLocaleTimeString('pt-BR').substring(0, 5)

      const result = sut.toLocaleTimeString(date)
      expect(result).toBe(expected)
    })

    it('should return the same time if it is already formatted', () => {
      const sut = new DateAdapter()

      const date = faker.date.future()
      const expected = date.toLocaleTimeString('pt-BR').substring(0, 5)

      const result = sut.toLocaleDateString(expected)
      expect(result).toBe(expected)
    })
  })

  describe('toLocaleDateTimeString()', () => {
    it('should return locale date time string formatted', () => {
      const sut = new DateAdapter()
      const date = faker.date.future()

      const expected = [
        date.toLocaleDateString('pt-BR').replace(/\//g, '-'),
        date.toLocaleTimeString('pt-BR').substring(0, 5),
      ].join(' ')

      const result = sut.toLocaleDateTimeString(date)
      expect(result).toBe(expected)
    })

    it('should return the same date time if it is already formatted', () => {
      const sut = new DateAdapter()
      const date = faker.date.future()

      const expected = [
        date.toLocaleDateString('pt-BR').replace(/\//g, '-'),
        date.toLocaleTimeString('pt-BR').substring(0, 5),
      ].join(' ')

      const result = sut.toLocaleDateTimeString(expected)
      expect(result).toBe(expected)
    })
  })
})
