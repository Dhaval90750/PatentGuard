import React from 'react';
import { Box, Skeleton, Stack, TableCell, TableRow, Grid, Card, CardContent } from '@mui/material';

/**
 * @desc    Enterprise Table Skeleton (V5.1 Fulfillment)
 */
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <>
    {Array(rows).fill(0).map((_, i) => (
      <TableRow key={i}>
        {Array(cols).fill(0).map((_, j) => (
          <TableCell key={j}><Skeleton height={40} /></TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

/**
 * @desc    Enterprise Card Skeleton (V5.1 Fulfillment)
 */
export const CardSkeleton = () => (
  <Card sx={{ height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
    <CardContent>
      <Stack spacing={1}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={80} width="40%" />
        <Skeleton variant="text" width="80%" sx={{ mt: 2 }} />
      </Stack>
    </CardContent>
  </Card>
);

/**
 * @desc    Enterprise Grid Skeleton (V5.1 Fulfillment)
 */
export const GridSkeleton = () => (
  <Grid container spacing={3}>
    {Array(6).fill(0).map((_, i) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
        <CardSkeleton />
      </Grid>
    ))}
  </Grid>
);
