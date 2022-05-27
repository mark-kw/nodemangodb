import fs from 'fs';
import { MongoClient } from 'mongodb';
import readline from 'readline';

function column_index() {
    const fields = "siren,nic,siret,statutDiffusionEtablissement,dateCreationEtablissement,trancheEffectifsEtablissement,anneeEffectifsEtablissement,activitePrincipaleRegistreMetiersEtablissement,dateDernierTraitementEtablissement,etablissementSiege,nombrePeriodesEtablissement,complementAdresseEtablissement,numeroVoieEtablissement,indiceRepetitionEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement,libelleCommuneEtrangerEtablissement,distributionSpecialeEtablissement,codeCommuneEtablissement,codeCedexEtablissement,libelleCedexEtablissement,codePaysEtrangerEtablissement,libellePaysEtrangerEtablissement,complementAdresse2Etablissement,numeroVoie2Etablissement,indiceRepetition2Etablissement,typeVoie2Etablissement,libelleVoie2Etablissement,codePostal2Etablissement,libelleCommune2Etablissement,libelleCommuneEtranger2Etablissement,distributionSpeciale2Etablissement,codeCommune2Etablissement,codeCedex2Etablissement,libelleCedex2Etablissement,codePaysEtranger2Etablissement,libellePaysEtranger2Etablissement,dateDebut,etatAdministratifEtablissement,enseigne1Etablissement,enseigne2Etablissement,enseigne3Etablissement,denominationUsuelleEtablissement,activitePrincipaleEtablissement,nomenclatureActivitePrincipaleEtablissement,caractereEmployeurEtablissement";
    var fields_include = ['siren', 'nic', 'siret', 'dateCreationEtablissement', 'dateDernierTraitementEtablissement', 'typeVoieEtablissement', 'libelleVoieEtablissement', 'codePostalEtablissement', 'libelleCommuneEtablissement', 'codeCommuneEtablissement', 'dateDebut', 'etatAdministratifEtablissement']
    var res = fields.split(',');
    var ftab = [];
    fields_include.forEach(element => {
        var index = res.indexOf(element);
        ftab[element] = index;
    });

    return ftab;
}

async function parse_file(file, ftab) {

    const fileStream = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: fileStream,
    });

    var parse = {}
    var arr = []
    for await (const line of rl) {
        var tab = line.split(",");
        for (var key in ftab) {
            parse[key] = tab[ftab[key]];
        }
        arr.push(parse);
        parse = {}

    }
    console.log("File parse");
    return arr
}


async function mango_insert(file, ftab) {
    var data;
    var tab_file = JSON.parse(file)

    const client = new MongoClient('mongodb://127.0.0.1:27017/');
    await client.connect();

    data = client.db("db_projet");
    var col = data.collection('projet');
    var batch = col.initializeUnorderedBulkOp();

    for (var i = 0; i < tab_file.length / 2; i++) {
        console.log(tab_file[i]);
        var tab = await parse_file("./my_csv/" + tab_file[i], ftab);
        for (var key in tab) {
            batch.insert(tab[key]);
        }

        await batch.execute(function(err, result) {
            // console.dir(err);
            // console.dir(result);

        });
    }
    client.close();

}

//console.log(column_index());
//parse_file("./my_csv/mynewcsv3.csv");
//console.log(process.argv[2])
//processLineByLine();
await mango_insert(process.argv[2], column_index());
//processLineByLine();