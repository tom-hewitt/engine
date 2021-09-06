import styled from "styled-components";

const Icon = styled.svg<{ color: string }>`
  fill: ${(props) => props.color};
  stroke: none;
  height: 15px;
  padding-right: 10px;
`;

export default function FunctionIcon(props: { color: string }) {
  return (
    <Icon color={props.color} viewBox="0 0 11 15">
      <path d="M9.86847 0.0747316C11.9224 0.75937 10.471 2.04656 9.86847 1.44402C9.26592 0.841468 10.1423 0.731984 9.73154 0.485512C9.32075 0.239039 8.90997 0.485512 8.36225 0.896299C7.81453 1.30709 6.85603 4.31953 6.99296 4.31954H7.95146V4.86725C7.95146 4.86725 6.58233 4.86726 6.7191 4.86725C6.85587 4.86724 5.21272 11.3029 4.25422 12.8091C3.29572 14.3154 2.61107 15 1.5158 15C0.420532 15 0.351732 14.4523 0.283432 14.3154C0.215132 14.1784 0.420361 12.9461 1.24194 13.3568C2.06351 13.7676 1.10501 14.1784 1.37886 14.4523C1.65272 14.7261 2.88508 14.5892 3.56973 12.2614C4.25438 9.93362 5.34981 4.86725 5.34981 4.86725H4.11745V4.31954C4.85127 4.32563 5.20204 4.2147 5.62367 3.63489C5.62367 3.63489 7.81453 -0.609907 9.86847 0.0747316Z" />
    </Icon>
  );
}