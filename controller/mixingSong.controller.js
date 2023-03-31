const ffmpeg = require('fluent-ffmpeg');
const command = ffmpeg();

const outPath = `${new Date().getTime()}.mp3`;

const audio1 = 'https://heariamdev.s3.amazonaws.com/1676658473202.mp3'
const audio2 = 'https://heariamdev.s3.amazonaws.com/1676530168549.mp3'

const mixingSong = async (req, res) => {

  command.input(audio2);
  command.input(audio1);
  command.output(outPath);

  command
    .complexFilter([
      {
        filter: 'amerge',
        options: { inputs: 2 }
      }
    ])
    .on('progress', function (progress) {
      console.log('progress', progress)
      console.log('Processing: ' + progress.percent + '% done');
    })
    .on('end', () => {
      console.log('musics have been merged successfully')
    })
    .saveToFile(outPath)

  res.send('musics have been merged successfully')
}

module.exports = mixingSong;
