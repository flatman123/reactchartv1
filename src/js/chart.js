import React from 'react';
import ReactDOM from 'react-dom';
import { selectAll, csvParse, max } from 'd3';
import { arc,
         csv,
         scaleLinear, 
         scaleBand, 
         select,
         axisLeft,
         axisBottom} from 'd3';


class Chart extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            newColor: 'blue',
            rendered: false,
            cData: null
        }
   }

    componentDidUpdate(){
        // D3 CODE
        const rectWidth = 500;
        const rectHeight = 200;
        const data = this.state.cData;
        const population = d => d.population;
        const countries = d => d.population;
        const margin = { top: 20, right:20, bottom:20, left:90 };
        const innerWidth =  +this.props.width - (margin.right + margin.left);
        const innerHeight = +this.props.width - (margin.top + margin.bottom);


        const xScale = scaleLinear()
                        .domain([0,max(data, population)]) // this is your data
                        .range([0, innerWidth])  //this is your Data Space

            //The x Axies will create a scale based on the Scale we give it.
                //in this case it will be xScale

        const yScale = scaleBand()
                        .domain(data.map(countries))
                        .range([0, innerHeight])

        const svg = select('svg')
                        .append('g')
                        .attr('transform', `translate(${margin.left}, ${margin.top})`);
                        
            //This will create a scale for the yAxis
        svg.append('g').call(axisLeft(yScale));
        svg.append('g').call(axisBottom(xScale))
                       .attr('transform', `translate(0, ${innerHeight})`);

        const chart = svg.selectAll('rect')
                            .data(data)
                            .enter()
                            .append('rect')
                                .attr('y', d => yScale(countries(d)))
                                .attr('width', d => xScale(population(d))) // Sets each rect to be te length of the value
                                .attr('height', yScale.bandwidth())
                                    .attr('fill', this.state.newColor)

   }


    UNSAFE_componentWillMount(){
            //Fetch data from CSV file
        const csvData = "https://cdn.shopify.com/s/files/1/0147/7997/3732/files/countries.csv?v=1584617981";

        csv(csvData)
            .then(data => {
                data.forEach(obj => obj['population'] = +obj['population'] * 1000);
                this.setState({cData: data}) 
            })
            .catch(err => err);
    }

    shouldComponentUpdate(){
        //IF WE WILL BE PULLING IN NEW DATA FROM D3, THEN WE will need to control the dom.
        // Therefore we need for React to never update re-render the Dom
        //This is D3's responsidbility.
        //SINCE WE'RE ONLY PULLING FROM CSV ONCE, WE SET IT TO TRUE
        return true;
    }

    render(){

        return (
            <div>
                <svg width={this.props.width} height={this.props.height}/>       
            </div>      
            
        )
    }
}

export default Chart;