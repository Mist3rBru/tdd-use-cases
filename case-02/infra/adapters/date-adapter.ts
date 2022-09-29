export interface ILocaleDateConversor {
  toLocaleDateString(data: Date | string): string
}

export interface ILocaleTimeConversor {
  toLocaleTimeString(data: Date | string): string
}

export interface ILocaleDateTimeConversor {
  toLocaleDateTimeString(data: string | Date): string
}

export interface IDateConversor
  extends ILocaleDateConversor,
    ILocaleTimeConversor,
    ILocaleDateTimeConversor {}

export class DateAdapter implements IDateConversor {
  toLocaleDateString(data: Date | string): string {
    const date: string = data instanceof Date ? data.toISOString() : data

    /**
     *  2022-09-28T16:00:19.530Z -> 28-09-2022
     *  28-09-2022 16:00 -> 28-09-2022
     *  28-09-2022 -> 28-09-2022
     */
    return date
      .replace(/^([0-9]{4}).([0-9]{2}).([0-9]{2}).+$/g, '$3-$2-$1')
      .replace(/^([0-9-]{10}).+$/g, '$1')
  }

  toLocaleTimeString(data: Date | string): string {
    const UTC = -3
    const date: string =
      data instanceof Date
        ? new Date(
            data.getFullYear(),
            data.getMonth(),
            data.getDate(),
            data.getHours() + UTC,
            data.getMinutes()
          ).toISOString()
        : data

    /**
     *  2022-09-28T16:00:19.530Z -> 16:00
     *  28-09-2022 16:00 -> 16:00
     *  16:00 -> 16:00
     */
    return date
      .replace(/^.+T([0-9:]{5}).+$/i, '$1')
      .replace(/^.+\s([0-9:]{5})$/i, '$1')
  }

  toLocaleDateTimeString(data: string | Date): string {
    const date = this.toLocaleDateString(data)
    const time = this.toLocaleTimeString(data)
    
    /**
     *  2022-09-28T16:00:19.530Z -> 28-09-2022 16:00
     *  28-09-2022 16:00 -> 28-09-2022 16:00
     */
    return `${date} ${time}`
  }
}
