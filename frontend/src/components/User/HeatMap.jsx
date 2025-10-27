import HeatMap from '@uiw/react-heat-map'
import { useEffect, useState } from 'react'

const generateActivityData = (startDate,endDate)=>{
    const data = []
    let currentDate = new Date(startDate)
    const end = new Date(endDate)
    
    while(currentDate <= end){
        const count = Math.floor(Math.random()*5)
        data.push({
            date:currentDate.toISOString().split("T")[0],
            count:count
        })
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
}

const getPanelColors = (maxCount)=>{
    const colors = {}
    for (let index = 0; index <= maxCount; index++) {
        const greenValue = Math.floor((index/maxCount)*255)
        colors[index] = `rgb(0,${greenValue},0)`

    }
    return colors 

}

const HeatMapProfile = ({minWidthValue})=>{
    const [activityData,setActivityData] = useState([])
    const [panelColors,setPanelColors] = useState({})

    useEffect(()=>{
        const fetchData = async()=>{
            const startDate = "2001-03-01"
            const endDate = "2001-09-31"
            const data = generateActivityData(startDate,endDate)
            setActivityData(data)

            const maxCount = Math.max(...data.map((d)=>d.count))
            setPanelColors(getPanelColors(maxCount))

        }

        fetchData()

    },[])

    return(
        <div>
            <h4>Recent Contributions</h4>
            <HeatMap
            className='HeatMapProfile'
            style={{minWidth:`${minWidthValue}`,height:"200px",color:"white"}}
            value={activityData}
            weekLabels={["Sun","Mon","Tue","Wed","Thus","Fri","Sat"]}
            startDate={new Date("2001-01-01")}
            rectSize={15}
            space={3}
            rectProps={{
                rx:3
            }}
            panelColors={panelColors}
            />
        </div>
    )
}

export default HeatMapProfile