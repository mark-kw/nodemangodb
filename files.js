import fs from 'fs';

export async function processLineByLine() {
    const fileStream = fs.createReadStream('/Users/markkissi/final.csv');
    console.time("monTimer");
    var i = 0;
    fileStream.on('readable', () => {
        var buffer;
        while ((buffer = fileStream.read(60000000)) !== null) {
            fs.appendFile('./my_csv/mynewcsv' + i + '.csv', buffer, function(err) {
                if (err) throw err;
            });
            i++;
        }

    })
    fileStream.on('end', () => {
        console.timeEnd('monTimer')
    })
}

// processLineByLine();
//console.log(processLineByLine());
// module.exports = { processLineByLine };