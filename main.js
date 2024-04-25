//Create a folder "baseFolder". In folder create 5 folders, in each of which create 5 files with the extension txt.
// Display in the console the paths to each file or folder, also display information about whether it is a file or a directory
const path = require('node:path');
const fs = require('node:fs/promises');

async function createFolder(folderName){
    await fs.mkdir(path.join(__dirname,'baseFolder',folderName),{recursive:true})
}

async function createTxtFile(folderName, file){
    await fs.writeFile(path.join(__dirname,'baseFolder',folderName,file),'');
}

async function createFewFiles(folderName, startNumber) {
    let num = startNumber;
    for (let i = 0; i < 5; i++) {
        await createTxtFile(folderName,`file_${num}.txt`);
        num++;
    }
}

async function displayFolderOrFileInfo(baseFolderPath){
    try {
        const entries = await fs.readdir(baseFolderPath,{withFileTypes:true});

        for (const entry of entries) {
            const fullPath = path.join(baseFolderPath, entry.name);

            if (entry.isDirectory()){
                console.log(`${fullPath} is a directory`);
                await displayFolderOrFileInfo(fullPath);
            }else {
                console.log(`${fullPath} is a file`);
            }
        }
    }catch (e) {
        console.error(e);
    }
}

async function func(){
    try {
        await createFolder('folder1');
        await createFolder('folder2');
        await createFolder('folder3');
        await createFolder('folder4');
        await createFolder('folder5');

        await createFewFiles('folder1',11);
        await createFewFiles('folder2',22);
        await createFewFiles('folder3',33);
        await createFewFiles('folder4',44);
        await createFewFiles('folder5',55);

        const baseFolderPath = path.join(__dirname,'baseFolder');

        await displayFolderOrFileInfo(baseFolderPath);

    }catch (e) {
        console.error(e);
    }
}

void func();
