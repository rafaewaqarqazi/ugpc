import fetch from 'isomorphic-unfetch';

const Index = ({data}) => {
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    );
};
Index.getInitialProps = async function(){
    const res = await fetch('http://localhost:3000/api/projects/all');
    const data = await res.json();
    console.log(data);
    return {data}
};

export default Index;