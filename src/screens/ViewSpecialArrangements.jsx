import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@mui/material/IconButton";

const ViewSpecialArrangements = ({ eventId, handleCloseModal }) => {
  const { state } = useLocation();
  const [arrangements, setArrangements] = useState([]);
  const [maxIndex, setMaxIndex] = useState(0); // stores index of arragnment with max length

  const getSpecialArrangements = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/events/getSpecialArrangements/${state._id}`
    );
    console.log(res.data.arrangements, "These are the arrangements returned");
    setArrangements(res.data.arrangements);
    const largestIndex = res.data.arrangements.reduce((acc, cur, i) => {
      if (cur.length > res.data.arrangements[acc].length) {
        return i;
      } else {
        return acc;
      }
    }, 0);
    console.log(largestIndex, "largest", res.data.arrangements);
    setMaxIndex(largestIndex);
  };

  useEffect(() => {
    getSpecialArrangements();
  }, [eventId]);

  const handleDelete = async (arrangement) => {
    console.log(arrangement);
    const res = await axios.put(
      `http://localhost:5000/api/events/specialArrangement/${state._id}`,
      {
        arrangement: arrangement,
      }
    );
    console.log(res.data);
    getSpecialArrangements();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="special arrangements table">
        <TableHead sx={{ bgcolor: "black" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Name</TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Quantity
            </TableCell>
            <TableCell align="right" sx={{ color: "white" }}>
              Price
            </TableCell>

            {arrangements && maxIndex && arrangements[maxIndex].length > 3 ? (
              Object.keys(arrangements[maxIndex])
                .slice(3) // skip first 3 columns (name, quantity, price)
                .map((column) => (
                  <TableCell
                    key={column}
                    align="center"
                    sx={{ color: "white" }}
                  >
                    Additional Detail
                  </TableCell>
                ))
            ) : (
              <></>
            )}
            <TableCell align="right" sx={{ color: "white" }}>
              Delete
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrangements.map((arrangement, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {arrangement[0]}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {arrangement[1]}
              </TableCell>
              <TableCell component="th" scope="row" align="right">
                {arrangement[2]}
              </TableCell>
              {arrangement.length !== 0 && (
                <>
                  {Object.keys(arrangement)
                    .slice(3) // skip first 3 columns (name, quantity, price)
                    .map((column) => (
                      <TableCell key={column} align="center">
                        {arrangement[column]}
                      </TableCell>
                    ))}
                  {Object.keys(arrangements[maxIndex])
                    .slice(arrangement.length) // skip first 3 columns (name, quantity, price)
                    .map((column) => (
                      <TableCell key={column} align="center">
                        -
                      </TableCell>
                    ))}
                </>
              )}
              <TableCell align="right">
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(arrangement)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewSpecialArrangements;
