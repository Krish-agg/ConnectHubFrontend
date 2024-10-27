import React from 'react'
import {Line,Doughnut} from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale,ArcElement, Tooltip, Legend,LineElement, PointElement, LinearScale, Filler} from "chart.js";
import { green, lightgreen, lightpurple, orange, purple } from '../constants/color';
import { getLast7Days } from '../lib/features';


ChartJS.register(LineElement, PointElement, LinearScale, Filler,CategoryScale,ArcElement, Tooltip, Legend);
const LineChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:false,
        },
        title:{
            display:false,
        }
    },
    scales:{
        x:{
            grid:{
                display:false,
            },
        },
        y:{
            beginAtZero:true,
            grid:{
                display:false,
            }
        }
    }
}
const LineChart=({value=[]})=>{
    const labels=getLast7Days();
    const data={
        labels,
        datasets:[{
            data:value,
            label:"Messages",
            fill:true,
            backgroundColor:lightpurple,
            borderColor:purple,
        },
        
    ],
    }
    return <Line data={data} options={LineChartOptions}/>
}
const doughnutChartOptions={
    responsive:true,
    plugins:{
        legend:{
            display:true,
        },
        title:{
            display:true,
        }
    },
    cutout:100
}
const DoughnutChart=({value=[],labels=[]})=>{
    const data={
        labels,
        datasets:[{
            data:value,
            fill:true,
            backgroundColor:[lightpurple,lightgreen],
            borderColor:[purple,green],
            offset:40
        },
        
    ],
    }
    return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions}/>
}

export {LineChart,DoughnutChart};