import styled from "styled-components";
import typeColors from "../../../styles/typeColors";
import LiteralFloat from "../LiteralFloat/LiteralFloat";

let Container = styled.div`
    display: inline-flex;
    flex-direction: column;

    border: 1px solid ${typeColors["3D Vector"]}};
    box-sizing: border-box;
    border-radius: 8px;
`;

let Field = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: 10px;
`;

let FieldName = styled.span`
    font-family: IBM Plex Mono;
    font-weight: 500;
    font-size: 10px;

    margin-right: 10px;

    color: ${typeColors["3D Vector"]};
`

let Name= styled.span`
    font-family: IBM Plex Mono;
    font-weight: 500;
    font-size: 10px;
    color: ${typeColors["3D Vector"]};

    margin: 10px 10px 0px 10px;
`


export default function Literal3DVector(props: { value: vector3d, onSubmit: (value: vector3d) => void }) {
    return (
        <Container>
            <Name>3D VECTOR</Name>
            <Field>
                <FieldName>x:</FieldName>
                <LiteralFloat value={props.value.x} onSubmit={(value) => props.onSubmit({ ...props.value, x: value })}/>
            </Field>
            <Field>
                <FieldName>y:</FieldName>
                <LiteralFloat value={props.value.y} onSubmit={(value) => props.onSubmit({ ...props.value, y: value })}/>
            </Field>
            <Field>
                <FieldName>z:</FieldName>
                <LiteralFloat value={props.value.z} onSubmit={(value) => props.onSubmit({ ...props.value, z: value })}/>
            </Field>
        </Container>
    );
};