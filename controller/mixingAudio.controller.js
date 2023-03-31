const ffmpeg = require('fluent-ffmpeg');

const outPath = `${new Date().getTime()}.mp3`;

const audio1 = 'https://heariamdev.s3.amazonaws.com/1676658473202.mp3'
const audio2 = 'https://heariamdev.s3.amazonaws.com/1676530168549.mp3'

const mixingAudio = async (req, res) => {
  // Create a new ffmpeg command instance for the first audio file
  const command1 = ffmpeg();
  command1.input(audio1);

// Get the duration of the first audio file using ffprobe
  command1.ffprobe(function(err, data) {
    if (err) {
      console.error('Error while getting audio duration: ' + err.message);
      return;
    }

    const duration1 = data.format.duration;
    console.log('Duration of audio 1: ' + duration1);

    // Create a new ffmpeg command instance for the second audio file
    const command2 = ffmpeg();
    command2.input(audio2);

    // Get the duration of the second audio file using ffprobe
    command2.ffprobe(function(err, data) {
      if (err) {
        console.error('Error while getting audio duration: ' + err.message);
        return;
      }

      const duration2 = data.format.duration;
      console.log('Duration of audio 2: ' + duration2);

      // Determine which audio file is longer and set the input order accordingly
      let input1, input2;
      if (duration1 > duration2) {
        console.log('Audio 1 is longer than audio 2');
        input1 = audio1;
        input2 = audio2;
      } else {
        console.log('Audio 2 is longer than audio 1');
        input1 = audio2;
        input2 = audio1;
      }

      // Create a new ffmpeg command instance for merging the audio files using amerge filter
      const command = ffmpeg();
      command.input(input1);
      command.input(input2);
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
          console.log('audio have been merged successfully')
        })
        .saveToFile(outPath)
    });
  });

  res.send('audio have been merged successfully')
}

module.exports = mixingAudio;
