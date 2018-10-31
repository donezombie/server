import { Playlist } from '.'

let playlist

beforeEach(async () => {
  playlist = await Playlist.create({ title: 'test', videos: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = playlist.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(playlist.id)
    expect(view.title).toBe(playlist.title)
    expect(view.videos).toBe(playlist.videos)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = playlist.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(playlist.id)
    expect(view.title).toBe(playlist.title)
    expect(view.videos).toBe(playlist.videos)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
