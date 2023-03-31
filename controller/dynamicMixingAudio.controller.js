const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const _ = require("lodash");

ffmpeg.setFfmpegPath(ffmpegPath);

const audio1 = 'https://heariamdev.s3.amazonaws.com/1676658473202.mp3';
const audio2 = 'https://heariamdev.s3.amazonaws.com/1676530168549.mp3';
const audio3 = 'https://heariamdev.s3.amazonaws.com/1676318220970.mp3';

const inputAudios = [
  {path: audio1, volume: 0.5},
  {path: audio2, volume: 1.0},
  {path: audio3, volume: 0.3},
];

const outPath = `${new Date().getTime()}.mp3`;

const dynamicMixingAudio = async (req, res) => {

// Get the duration of each input audio
  let setAudioSequence = inputAudios.map((inputAudio, index) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputAudio.path, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          let tempAudio = inputAudios[index];

          resolve({
            ...tempAudio,
            durations: metadata.format.duration
          })
        }
      });
    });
  });

  let arr = await Promise.all(setAudioSequence);
  arr = _.orderBy(arr, 'durations', 'desc')

  let command = ffmpeg();
  for (let i = 0; i < arr.length; i++) {
    command.input(arr[i].path)
  }

  command.output(outPath);
  command
    .complexFilter([
      {
        filter: 'amerge',
        options: { inputs: inputAudios.length }
      }
    ])
    .on('progress', function (progress) {
      console.log('progress', progress)
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', () => {
      console.log('audio have been merged successfully')
    })
    .saveToFile(outPath)

  res.send('audio have been merged successfully')
}

module.exports = dynamicMixingAudio;
