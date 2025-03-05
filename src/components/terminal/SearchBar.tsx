import { FormEvent, useCallback, useEffect, useState } from "react";
import { VscCaseSensitive } from "react-icons/vsc";
import './SearchBar.css';

interface SearchBarProps {
    searchRegEx: RegExp|null;
    setSearchRegEx: React.Dispatch<React.SetStateAction<RegExp|null>>;
    setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar:React.FC<SearchBarProps> = ({ searchRegEx, setSearchRegEx, setShowSearchBar }) => {
    const [sensitive, setSensitive] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const onInputChange = useCallback((e: FormEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
        setSearchRegEx(new RegExp('('+e.currentTarget.value+')', sensitive ? 'g' : 'gi'));
    }, [sensitive])

    useEffect(() => {
        console.log(searchRegEx);
    },[searchRegEx])

    const onInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape' || e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            setShowSearchBar(false);
        }
    },[]);

    const toggleSensitive = useCallback(() => {
        const newSensitive = !sensitive;
        setSensitive(newSensitive);
        setSearchRegEx(new RegExp('('+inputValue+')', newSensitive ? 'g' : 'gi'));
    },[inputValue, sensitive]);

    return (
        <form className="searchBar">
            <button onClick={toggleSensitive} type="button" className={`searchBarCasesensitiveBtn ${sensitive ? 'btnActive' : ''}`}><VscCaseSensitive /></button>
            <input spellCheck={false} className="searchBarInput" type="text" placeholder="Search..." onChange={onInputChange} onKeyDown={onInputKeyDown} value={inputValue}/>
        </form>
    );
}

export default SearchBar;