import {
  Container,
  Empty,
  Loader,
  Pagination,
  Table,
} from "@/shared/components"
import { IconSax } from "@/shared/icons"
import { DEFAULT_DATETIME_FORMAT } from "@/shared/utils/date"
import { formatNumber } from "@/shared/utils/number"
import dayjs from "dayjs"
import { useChains } from "wagmi"
import { useWithdrawalHistory } from "./use-withdrawal-history"

export default function WithdrawalHistory() {
  const { data, isLoading, page, setPage } = useWithdrawalHistory()

  const chains = useChains()

  function _getBlockUrl(tx: string, chainId: string) {
    const chain = chains.find(c => c.id === +chainId)
    if (!chain) return ""
    return chain.blockExplorers?.default.url + "/tx/" + tx
  }

  return (
    <Container className="space-y-[52px] pt-[100px]">
      <div className="inline-flex items-center gap-3">
        <div className="text-2xl font-semibold">Withdrawal History</div>
        <div className="rounded-[4px] bg-foreground/10 px-2 py-1 text-lg font-medium">
          {data?.total ?? 0}
        </div>
      </div>

      <Table>
        <Table.Header>
          <Table.Column align="left">Withdrawal ID</Table.Column>
          <Table.Column align="left">Request Date</Table.Column>
          <Table.Column align="left">Amount (USDT)</Table.Column>
          <Table.Column align="left">Status</Table.Column>
          <Table.Column align="left">Completion Date</Table.Column>
          <Table.Column align="left">IP Address</Table.Column>
          <Table.Column align="left">TX Link</Table.Column>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : !data?.list.length ? (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Empty>No orders yet</Empty>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.list.map(withdrawal => (
              <Table.Row key={withdrawal.id}>
                <Table.Cell align="left">#{withdrawal.id.slice(-4)}</Table.Cell>
                <Table.Cell align="left">
                  {dayjs(withdrawal.request_date).format(
                    DEFAULT_DATETIME_FORMAT,
                  )}
                </Table.Cell>
                <Table.Cell align="left">
                  {formatNumber(withdrawal.amount)} USDT
                </Table.Cell>
                <Table.Cell align="left">{withdrawal.status_string}</Table.Cell>
                <Table.Cell align="left">
                  {withdrawal.completed_date
                    ? dayjs(withdrawal.completed_date).format(
                        DEFAULT_DATETIME_FORMAT,
                      )
                    : "_"}
                </Table.Cell>
                <Table.Cell align="left">{withdrawal.ip_address}</Table.Cell>
                <Table.Cell align="left">
                  <a
                    href={_getBlockUrl(withdrawal.tx_id, withdrawal.chain_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconSax.ExportSquare size={24} />
                  </a>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <div className="inline-flex w-full justify-center">
        <Pagination
          count={data?.total}
          pageSize={10}
          page={page}
          onPageChange={({ page }) => setPage(page)}
        />
      </div>
    </Container>
  )
}
