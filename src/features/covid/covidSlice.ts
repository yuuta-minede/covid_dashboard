import { createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import { RootState } from '../../app/store'
import dataJson from "./data.json"
import dataJsonDaily from "./dataDaily.json"


const apiUrl = "https://covid19.mathdro.id/api"

type APIData = typeof dataJson
type APIDataDaily = typeof dataJsonDaily

type covidState = {
    data: APIData
    country: string
    dailyData: APIDataDaily
}

// 初期値を登録
const initialState: covidState = {
    data: {
    				"confirmed": {
                "value": 44482501,
                "detail": "https://covid19.mathdro.id/api/confirmed"
            },
            "recovered": {
                "value": 30052209,
                "detail": "https://covid19.mathdro.id/api/recovered"
            },
            "deaths": {
                "value": 1174031,
                "detail": "https://covid19.mathdro.id/api/deaths"
            },
            "dailySummary": "https://covid19.mathdro.id/api/daily",
            "dailyTimeSeries": {
                "pattern": "https://covid19.mathdro.id/api/daily/[dateString]",
                "example": "https://covid19.mathdro.id/api/daily/2-14-2020"
            },
            "image": "https://covid19.mathdro.id/api/og",
            "source": "https://github.com/mathdroid/covid19",
            "countries": "https://covid19.mathdro.id/api/countries",
            "countryDetail": {
                "pattern": "https://covid19.mathdro.id/api/countries/[country]",
                "example": "https://covid19.mathdro.id/api/countries/USA"
            },
            "lastUpdate": "2020-10-29T05:24:35.000Z"
    },
    country: "japan",
    dailyData: [
        {
            "totalConfirmed": 555,
            "mainlandChina": 548,
            "otherLocations": 7,
            "deltaConfirmed": 0,
            "totalRecovered": 0,
            "confirmed": {
                "total": 555,
                "china": 548,
                "outsideChina": 7
            },
            "deltaConfirmedDetail": {
            "total": 0,
            "china": 0,
            "outsideChina": 0
            },
            "deaths": {
                "total": 17,
                "china": 17,
                "outsideChina": 0
            },
            "recovered": {
                "total": 0,
                "china": 0,
                "outsideChina": 0
            },
            "active": 0,
            "deltaRecovered": 0,
            "incidentRate": 0.44821646978651847,
            "peopleTested": 0,
            "reportDate": "2020-01-22"
        }
    ]
}

export const fetchAsyncGet = createAsyncThunk(
    'covid/get', async() => { //covid/getはactionの名前
        const { data } = await axios.get<APIData>(apiUrl) //apiUrlにgetして取得
        // console.log(data)
        return data
    }
)

export const fetchAsyncGetDaily = createAsyncThunk(
    'covid/getDaily', async() => {
        const { data } = await axios.get<APIDataDaily>(`${apiUrl}/daily`)
        console.log(data)
        return data
    }
)

// covid/getCountryにアクセスすると、非同期でdynamicUrlにあるdataと、countryを返す
export const fetchAsyncGetCountry = createAsyncThunk(
    'covid/getCountry', async(country: string) => {
        let dynamicUrl = apiUrl
        if(country){
            dynamicUrl = `${apiUrl}/countries/${country}`
        }
        const {data} = await axios.get<APIData>(dynamicUrl)
        // console.log(data)
        // console.log(country)
        return { data: data, country: country }
    }
)

const covidSlice = createSlice({
    name: "covid",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGet.fulfilled,(state, action)=>{
            return{
                ...state,
                data: action.payload
            }
        })
        builder.addCase(fetchAsyncGetDaily.fulfilled,(state, action)=>{
            return{
                ...state,
                dailyData: action.payload
            }
        })
        builder.addCase(fetchAsyncGetCountry.fulfilled,(state, action)=>{
            return{
                ...state,
                data: action.payload.data,
                country: action.payload.country
            }
        })
    }
})

export const selectData = (state: RootState) => state.covid.data
export const selectDailyData = (state: RootState) => state.covid.dailyData
export const selectCountry = (state: RootState) => state.covid.country

export default covidSlice.reducer
