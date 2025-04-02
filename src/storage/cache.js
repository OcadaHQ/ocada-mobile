import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';


export const clearAllCache = async () => {  

    await Image.clearMemoryCache();
    await Image.clearDiskCache();
    

    const cacheDir = FileSystem.cacheDirectory;
    const files = await FileSystem.readDirectoryAsync(cacheDir);
    await Promise.all(
        files.map(async file => {
        const filePath = `${cacheDir}${file}`;
        await FileSystem.deleteAsync(filePath);
        })
    );
}
