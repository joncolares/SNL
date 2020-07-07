import React, {useEffect, useState , ChangeEvent, FormEvent} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import logo from '../../assets/logo.svg';

import './style.css';

const CreatePoint = () =>{

    interface Item{
        id:number;
        title:string;
        image_url: string;
    }

    interface IBGEUfResponse{
        sigla:string;
    }

    interface IBGEcityResponse{
        nome:string;
    }

    const [itens, setItens] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selectUfs, setselectUfs] = useState('0');
    const [selectCity, setselectCity] = useState('0');
    const [selectedPosition, setselectedPosition] = useState<[number, number]>([0,0]);
    const [selectedItens, setselectedItens] = useState<number[]>([]);

    const history = useHistory();


    useEffect(() => {
        api.get('itens').then(response =>{
            setItens(response.data);
        })
    }, []);

    useEffect(() =>{
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response =>{
            const ufInitials = response.data.map(uf => uf.sigla);
        
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() =>{
        if(selectUfs === '0'){
            return ;
        }
        axios.get<IBGEcityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUfs}/municipios`).then(response =>{
            const cityNames = response.data.map(city => city.nome);
        
            setCities(cityNames);
        });

    }, [selectUfs]);

    function handleSelectUf(event : ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;

        setselectUfs(uf);
        
    }

    function handleSelectcity(event : ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;

        setselectCity(city);
        
    }

    function handleSelectPosition(event : LeafletMouseEvent){
       setselectedPosition([
        event.latlng.lat,
        event.latlng.lng 
       ]);
        
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){

        const {name, value} = event.target;
        setFormData({...formData, [name]: value})

    }

    function handleSelectItem(id : number){
        const alreadySelectedItens = selectedItens.findIndex(item => item === id);

        if(alreadySelectedItens >=0){
            const filteredItens = selectedItens.filter(item => item !== id);

            setselectedItens(filteredItens);

        }else{
            setselectedItens([...selectedItens, id]);
        }

        
        
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        
        const {name, email, whatsapp} = formData;
        const uf = selectUfs;
        const city = selectCity;
        const [latitude, longitude] = selectedPosition;
        const  itens = selectedItens;
        
        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            itens
        }

        await api.post('points', data);
        alert('Ponto de coleta Criado com sucesso');
        history.push('/');
        
    }

    return(
        <div id="page-create-point">
            <header>
              <img src={logo} alt="Ecoleta"/> 

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home                     
                </Link> 
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">e-Mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />  
                        </div> 
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-3.094144, -60.0143432]} zoom={15} onClick={handleSelectPosition}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                            name="uf" 
                            id="uf" 
                            value={selectUfs}
                            onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}> {uf} </option>
                                ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                            name="city"
                            id="city"
                            value={selectCity}
                            onChange={handleSelectcity}
                            >
                                {cities.map(city => (
                                    <option key={city} value={city}> {city} </option>
                                ))
                                }
                                <option value="0">Selecione uma cidade</option>
                            </select>
                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {itens.map(item =>
                            (<li 
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItens.includes(item.id) ? 'selected' : ''}
                            >
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>)
                        )}
                        

                    </ul>

                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    );
};

export default CreatePoint;