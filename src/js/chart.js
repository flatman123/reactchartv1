import React from 'react';
import LoadChart from './d3specs';
import '../styles/style.scss';
import { max } from 'd3';
import { csv,
         scaleLinear, 
         scaleBand, 
         select,
         axisLeft,
         axisBottom} from 'd3';


class Chart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rendered: false,
            cData: null
        }
        this.fetchData = this.fetchData.bind(this);
   }

    componentDidUpdate(){
        // D3 CODE
        const rectWidth = 500;
        const rectHeight = 500;
        const data = this.state.cData;
        const population = d => d.population;
        const countries = d => d.population;
        const innerMargin = { top: 90, right:20, bottom:30, left:100 };
        const titleMargin = { top: 80, right:20, bottom:30, left:130 };
        const innerWidth =  +this.props.width - (innerMargin.right + innerMargin.left);
        const innerHeight = +this.props.height - (innerMargin.top + innerMargin.bottom);

        
        //Get Scales from Data
        const xScale = scaleLinear()
                        .domain([0,max(data, population)]) // this is your data
                        .range([0, innerWidth])  //this is your Data Space
          
        const yScale = scaleBand()
                        .domain(data.map(countries))
                        .range([0, innerHeight])
                        .padding(0.2)

                        //Chart Title
        const chartTitle = select('svg')
                                .append('g')
                                .attr('transform', `translate(${titleMargin.left},${titleMargin.top})`)
                                    .append('text')
                                    .text('Top Populated Countries')
                                    .attr('class','the-title')

                    
        //Group for InnerChart                
        const svg = select('svg')
                        .append('g')
                        .attr('transform', `translate(${innerMargin.left},${innerMargin.top})`);            
            

                //The y Axies will create a scale based on the Scale we give it.
                //in this case it will be yScale
                svg.append('g').call(axisLeft(yScale))
                        .selectAll('.domain, .tick line')
                                    .remove()

                //The x Axies will create a scale based on the Scale we give it.
                //in this case it will be xScale
                svg.append('g').call(axisBottom(xScale))
                        .attr('transform', `translate(0, ${innerHeight})`);


                //Generate Bars
                const chart = svg.selectAll('rect')
                                    .data(data)
                                    .enter()
                                    .append('rect')
                                        .attr('y', d => yScale(countries(d)))
                                        .attr('width', d => xScale(population(d))) // Sets each rect to be te length of the value
                                        .attr('height', yScale.bandwidth())
                                            .attr('fill', this.state.newColor)                                                          
    };

    fetchData(e){
        //Fetch data from CSV file
        const csvData = "https://cdn.shopify.com/s/files/1/0147/7997/3732/files/countries.csv?v=1584617981";
        csv(csvData)
            .then(data => {
                data.forEach(obj => obj['population'] = +obj['population'] * 1000);
                this.setState({cData: data}) 
            })            
    };

    render(){
        return (
            <React.Fragment>
                <h1>CLICK TO LOAD CHART</h1>
                <LoadChart  renderChart={this.fetchData} /> 
                <svg width={this.props.width} height={this.props.height}></svg>              
            </React.Fragment>         
        )
    }
}

export default Chart;
