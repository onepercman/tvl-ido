import {
  Container,
  Dialog,
  Empty,
  Loader,
  Pagination,
  Table,
} from "@/shared/components"
import { useViewWidth } from "@/shared/hooks/use-view-width"
import { IconSax } from "@/shared/icons"
import { DEFAULT_DATETIME_FORMAT } from "@/shared/utils/date"
import { formatNumber } from "@/shared/utils/number"
import { getBlockUrl } from "@/shared/utils/web3"
import { Portal } from "@ark-ui/react"
import dayjs from "dayjs"
import {
  getTransactionStatusBadge,
  type OrderHistory,
} from "./order-history.interface"
import { useOrderHistory } from "./use-order-history"

export default function OrderHistory() {
  const { data, isLoading, page, setPage } = useOrderHistory()

  const vw = useViewWidth()

  const _isMobile = vw <= 640

  const columns = _isMobile ? mobileColumns : desktopColumns

  return (
    <Container className="space-y-[52px] pt-[100px]">
      <div className="inline-flex items-center gap-3">
        <div className="text-2xl font-semibold">Order History</div>
        <div className="rounded-[4px] bg-foreground/10 px-2 py-1 text-lg font-medium">
          {data?.total ?? 0}
        </div>
      </div>

      <Table>
        <Table.Header>
          {columns.map((col, index) => (
            <Table.Column key={index} align="left">
              {col.title}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : !data?.list.length ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                <Empty>No orders yet</Empty>
              </Table.Cell>
            </Table.Row>
          ) : (
            data.list.map(order => (
              <Table.Row key={order.order_id}>
                {columns.map((col, index) => (
                  <Table.Cell align="left" key={index}>
                    {col.render(order)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <div className="inline-flex w-full justify-center">
        <Pagination
          count={data?.total}
          page={page}
          pageSize={10}
          onPageChange={({ page }) => setPage(page)}
        />
      </div>
    </Container>
  )
}

const desktopColumns = [
  {
    title: "Order ID",
    field: "",
    render(row: OrderHistory) {
      return `#${row.order_id.slice(-4)}`
    },
  },
  {
    title: "Date",
    field: "",
    render(row: OrderHistory) {
      return dayjs(row.created_at).format(DEFAULT_DATETIME_FORMAT)
    },
  },
  {
    title: "Round",
    field: "",
    render(row: OrderHistory) {
      return `${row.round_name} ${row.tier_number}`
    },
  },
  {
    title: "Amount (USDC)",
    field: "",
    render(row: OrderHistory) {
      return formatNumber(row.amount)
    },
  },
  {
    title: "Total Tokens",
    field: "",
    render(row: OrderHistory) {
      return formatNumber(row.total_token)
    },
  },
  {
    title: "Status",
    field: "",
    render(row: OrderHistory) {
      return getTransactionStatusBadge(row.status)
    },
  },
  {
    title: "TX Link",
    field: "",
    render(row: OrderHistory) {
      return (
        <a
          href={getBlockUrl(row.transaction_id, row.chain_id)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconSax.ExportSquare size={24} />
        </a>
      )
    },
  },
]

const mobileColumns = [
  {
    title: "Order ID",
    render(row: OrderHistory) {
      return `#${row.order_id.slice(-4)}`
    },
  },
  {
    title: "Date",
    render(row: OrderHistory) {
      return dayjs(row.created_at).format(DEFAULT_DATETIME_FORMAT)
    },
  },
  {
    title: "",
    render(row: OrderHistory) {
      return (
        <Dialog>
          <Dialog.Trigger>
            <IconSax.ExportCurve />
          </Dialog.Trigger>
          <Portal>
            <Dialog.Content>
              <Dialog.CloseTrigger />
              <Dialog.Title>Detail</Dialog.Title>
              <hr className="mb-1 border border-line-2" />
              <table className="w-full border-separate border-spacing-y-5">
                <tbody>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">Order ID</td>
                    <td className="text-base font-medium">{`#${row.order_id.slice(-4)}`}</td>
                  </tr>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">Date</td>
                    <td className="text-base font-medium">
                      {dayjs(row.created_at).format(DEFAULT_DATETIME_FORMAT)}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">Round</td>
                    <td className="text-base font-medium">{`${row.round_name} ${row.tier_number}`}</td>
                  </tr>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">
                      Total Tokens
                    </td>
                    <td className="text-base font-medium">{row.total_token}</td>
                  </tr>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">Status</td>
                    <td className="text-base font-medium">
                      {getTransactionStatusBadge(row.status)}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-8 text-sm text-secondary">TX Link</td>
                    <td className="text-base font-medium">
                      <a
                        href={getBlockUrl(row.transaction_id, row.chain_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconSax.ExportSquare size={24} />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Dialog.Content>
          </Portal>
        </Dialog>
      )
    },
  },
]
