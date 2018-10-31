const _ = require('lodash')
let obj = { teachers: [],
  members: [],
  _id: '5bbcc6c0406241051c6d70b3',
  course: 'WEB',
  classroom: 123,
  session: 16,
  playlists: [
    {
      members: [],
      _id: '5bbcc54aeee0691c106b159b',
      unlock: false,
      playlist: '5bbcc54aeee0691c106b159b'
    },
    {
      members: [],
      _id: '5bbcc548eee0691c106b159a',
      unlock: false,
      playlist: '5bbcc548eee0691c106b159a'
    },
    {
      members: [],
      _id: '5bbcc546eee0691c106b1599',
      unlock: false,
      playlist: '5bbcc546eee0691c106b1599'
    }
  ],
  createdAt: '2018-10-09T15:18:24.126Z',
  updatedAt: '2018-10-09T15:19:16.709Z',
  keyword: 'web 123',
  __v: 1 }

console.log(obj)
_.remove(obj.playlists, {_id: '5bbcc548eee0691c106b159a'})

console.log(obj);

