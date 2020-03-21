import AsyncStorage from '@react-native-community/async-storage';
import { Subject } from 'rxjs';

const _onCrutialStoragesLoaded = new Subject();
let _countCrutialStorages = 0;

type PersistentData = any;

export default class LocalStoreService {
    static _listeners: any= {};
    static _cache: any= {};

    static save(key: string, value: PersistentData) {
        if (!value) {
            AsyncStorage.removeItem(key);
        } else {
            AsyncStorage.setItem(key, JSON.stringify(value));
        }
        LocalStoreService._cache[key] = value;
        if (LocalStoreService._listeners[key]) {
            LocalStoreService._listeners[key].next(value);
        }
    }

    static push = async (key: string, value: PersistentData) => {
        let arr: PersistentData = (await LocalStoreService.get(key)) || [];
        if (arr && Array.isArray(arr)) {
            arr.push(value);
        }
        LocalStoreService.save(key, arr);
    }

    static unshift = async (key: string, value: PersistentData, maxLength?: number) => {
        let arr: PersistentData = (await LocalStoreService.get(key)) || [];
        if (arr && Array.isArray(arr)) {
            arr.unshift(value);
            if (maxLength) {
                arr = arr.slice(0, maxLength);
            }
        }
        LocalStoreService.save(key, arr);
    }

    static removeFromArray = async (key: string, value: PersistentData) => {
        let arr = (await LocalStoreService.get(key)) || [];
        if (Array.isArray(arr)) {
            arr = arr.filter((v: PersistentData) => JSON.stringify(v) != JSON.stringify(value));
        }
        LocalStoreService.save(key, arr);
    }

    static removeFromArrayUsingId = async (key: string, id: string) => {
        let arr = (await LocalStoreService.get(key)) || [];
        if (Array.isArray(arr)) {
            arr = arr.filter((v: PersistentData) => v.id != id);
        }
        LocalStoreService.save(key, arr);
    }

    static get = async (key: string) => {
        if (LocalStoreService._cache[key] !== undefined) {
            console.log('LocalStore get from cache', key);
            return LocalStoreService._cache[key];
        }
        console.log('LocalStore get', key);
        let val:any = await AsyncStorage.getItem(key);
        console.log('LocalStore get received', key);
        if (val) {
            try{
                val = JSON.parse(val);
            } catch(e) { }
        }
        LocalStoreService._cache[key] = val;
        return val;
    }

    static onChange(key: string, cb: (value: PersistentData) => void){
        if (!LocalStoreService._listeners[key]) {
            LocalStoreService._listeners[key] = new Subject();
        }
        return LocalStoreService._listeners[key].subscribe(cb);
    }

    static incCrutialStorages(incBy = 1) {
        _countCrutialStorages += incBy;
    }

    static notifyOneCrutialStorageLoaded() {
        _countCrutialStorages--;
        if (LocalStoreService.areAllCrutialStoragesLoaded()) {
            _onCrutialStoragesLoaded.next();
        }
    }

    static onAllCrutialStoragesLoaded = _onCrutialStoragesLoaded;
    static areAllCrutialStoragesLoaded() {
        return _countCrutialStorages <= 0;
    };
}