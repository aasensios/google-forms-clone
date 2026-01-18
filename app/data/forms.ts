export type Form = {
  thumbnailUrl: string
  name: string
  shared: boolean
  lastOpen: string
}

export const forms: Form[] = [
  {
    thumbnailUrl: 'https://picsum.photos/seed/1/400/300',
    name: 'First form',
    shared: false,
    lastOpen: '08:13 AM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/2/400/300',
    name: 'Second form',
    shared: true,
    lastOpen: '10:43 PM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/3/400/300',
    name: 'Third form',
    shared: true,
    lastOpen: '07:49 PM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/4/400/300',
    name: 'Fourth form',
    shared: false,
    lastOpen: '12:08 PM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/5/400/300',
    name: 'Fifth form',
    shared: false,
    lastOpen: '05:11 PM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/6/400/300',
    name: 'Sixth form',
    shared: true,
    lastOpen: '02:08 PM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/7/400/300',
    name: 'Seventh form',
    shared: false,
    lastOpen: '03:17 AM',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/8/400/300',
    name: 'Eighth form',
    shared: true,
    lastOpen: 'Jan 12, 2023',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/9/400/300',
    name: 'Ninth form',
    shared: false,
    lastOpen: 'Nov 5, 2022',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/10/400/300',
    name: 'Tenth form',
    shared: false,
    lastOpen: 'Aug 22, 2022',
  },
  {
    thumbnailUrl: 'https://picsum.photos/seed/11/400/300',
    name: 'Eleventh form',
    shared: true,
    lastOpen: '—',
  },
]
