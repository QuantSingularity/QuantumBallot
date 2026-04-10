import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f8;
`;

export const LoadIndicator = styled.ActivityIndicator.attrs({
  color: "#2196F3",
  size: "large",
})``;
