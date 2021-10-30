import React from "react";
import Layout from "../../components/Layout";
import { getDeployedCampaigns } from "../index";
import { useQuery, dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button, Breadcrumb } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import Link from "next/link";

const getCampaignSummary = async (campaignAddress) => {
  const campaign = Campaign(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  return JSON.stringify(summary);
};
const campaignSummaryKey = "campaign-summary";

const CampaignShow = () => {
  const router = useRouter();
  const { data: summary = [] } = useQuery(
    [campaignSummaryKey, router.query.address],
    () => getCampaignSummary(router.query.address),
    {
      select: (data) => {
        const parsedSummary = JSON.parse(data || "{}");
        const summaryData = {
          minimumContribution: parsedSummary[0],
          balance: parsedSummary[1],
          requestsCount: parsedSummary[2],
          approversCount: parsedSummary[3],
          manager: parsedSummary[4],
        };
        return [
          {
            header: summaryData?.manager,
            meta: "Address of Manager",
            description:
              "The Manager created this campaign and can create requests to withdraw money",
            style: { overflowWrap: "break-word" },
          },
          {
            header: summaryData?.minimumContribution,
            meta: "Minimum contribution (wei)",
            description:
              "You must contribute at least this much wei to become an approver",
          },
          {
            header: summaryData?.requestsCount,
            meta: "Number of Requests",
            description:
              "A request tries to withdraw money from the contract. Request must be approved by approvers",
          },
          {
            header: summaryData?.approversCount,
            meta: "Number of Approvers",
            description:
              "Number of people who have already contributes to the campaign",
          },
          {
            header: web3.utils.fromWei(summaryData?.balance, "ether"),
            meta: "Campaign Balance (ether)",
            description:
              "The balance is how much money this campaign has left to spend",
          },
        ];
      },
    }
  );

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Section href="/">Campaigns</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>Details</Breadcrumb.Section>
      </Breadcrumb>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={summary} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddress={router.query.address} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${router.query.address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const allCampaigns = await getDeployedCampaigns();
  const paths = allCampaigns.map((address) => ({ params: { address } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([campaignSummaryKey, params?.address], () =>
    getCampaignSummary(params?.address)
  );
  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default CampaignShow;
