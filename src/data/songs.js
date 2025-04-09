// Import images
import vivaLaVidaCover from '../assets/covers/vivaLaVida.jpg';
import starboyCover from '../assets/covers/starboy.jpeg';
import mouthOfTheRiverCover from '../assets/covers/mouthOfTheRiver.jpg';
import ghostStoriesCover from '../assets/covers/ghostStories.jpg';
import sparksCover from '../assets/covers/sparks.jpeg';
import hymnForTheWeekendCover from '../assets/covers/hymeForTheWeekend.jpg';
import youGotThisCover from '../assets/covers/you got this.png'
import mouthoftheriveraudio from '../assets/audio/Mouth Of The River.mp3'
import starboyaudio from '../assets/audio/Starboy.mp3'
import hymefortheweekendaudio from '../assets/audio/Hymn For The Weekend Official Video.mp3'
import yougotthisaudio from '../assets/audio/You Got This.mp3'
import sparksaudio from '../assets/audio/Sparks.mp3'
import ghostStoriesaudio from '../assets/audio/Ghost Stories.mp3'
import vivalavidaaudio from '../assets/audio/Viva La Vida Official Video.mp3'
export const songs = [
  {
    id: 1,
    title: "Ghost Stories",
    artist: "Coldplay",
    duration: "3:10",
    cover: ghostStoriesCover,
    audioUrl: ghostStoriesaudio
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
    duration: "4:16",
    cover: starboyCover,
    audioUrl: starboyaudio
  },
  {
    id: 3,
    title: "Mouth of the river",
    artist: "Imagine Dragons",
    duration: "6:23",
    cover: mouthOfTheRiverCover,
    audioUrl: mouthoftheriveraudio
  },
  {
    id: 4,
    title: "Viva La Vida",
    artist: "Coldplay",
    duration: "5:32",
    cover: vivaLaVidaCover,
    audioUrl: vivalavidaaudio
  },
  {
    id: 5,
    title: "Sparks",
    artist: "Coldplay",
    duration: "4:23",
    cover: sparksCover,
    audioUrl: sparksaudio
  },
  {
    id: 6,
    title: "Hymn for the weekend",
    artist: "Coldplay",
    duration: "2:23",
    cover: hymnForTheWeekendCover,
    audioUrl: hymefortheweekendaudio
  },
  {
    id: 7,
    title: "You Got This",
    artist: "Fotty Seven",
    duration: "4:06",
    cover: youGotThisCover,
    audioUrl: yougotthisaudio
  }
];
