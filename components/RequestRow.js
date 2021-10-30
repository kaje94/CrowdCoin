import React, { useCallback } from "react";
import { Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import { useMutation } from "react-query";

const RequestRow = ({
  id,
  request,
  approversCount,
  campaignAddress,
  refetchRequests,
}) => {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > approversCount / 2;

  const {
    mutate: approveRequest,
    isLoading: isApproving,
    error: approveError,
    isError: isApproveError,
  } = useMutation(
    async (id) => {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(campaignAddress);
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
    },
    { onSuccess: refetchRequests }
  );

  const {
    mutate: finalizeRequest,
    isLoading: isFinalizing,
    error: finalizeError,
    isError: isFinalizeError,
  } = useMutation(
    async (id) => {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(campaignAddress);
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
    },
    { onSuccess: refetchRequests }
  );

  const onApprove = useCallback(() => approveRequest(id), [id]);
  const onFinalize = useCallback(() => finalizeRequest(id), [id]);

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button basic color="green" onClick={onApprove} loading={isApproving}>
            Approve
          </Button>
        )}
        <Message
          hidden={!isApproveError}
          error
          content={approveError?.message}
        />
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button
            basic
            color="teal"
            onClick={onFinalize}
            loading={isFinalizing}
          >
            Finalize
          </Button>
        )}

        <Message
          hidden={!isFinalizeError}
          error
          content={finalizeError?.message}
        />
      </Cell>
    </Row>
  );
};

export default RequestRow;
