import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Sheet,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/joy'
import RemoveIcon from '@mui/icons-material/Remove'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Unstable_Grid2'

const UploadButton = () => {
  return (
    <Sheet
      color="primary"
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        height: 0o160,
        borderRadius: '8px',
        flexDirection: 'column',
      }}
    >
      <Box>
        <AddIcon
          sx={{
            fontSize: '2rem',
          }}
        />
        <Typography
          level="body2"
          sx={{
            position: 'absolute',
            width: 1,
            color: 'inherit',
          }}
        >
          （最多 3 项）
        </Typography>
      </Box>
    </Sheet>
  )
}

const ImgItem = ({ onClick }: { onClick?: () => void }) => (
  <Grid
    xs={1}
    sx={{
      position: 'relative',
    }}
  >
    <Box
      sx={{
        background: 'url(https://picsum.photos/200/300)',
        height: 0o160,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
      }}
    />

    <Box
      sx={(theme) => ({
        display: 'flex',
        position: 'absolute',
        top: 0,
        right: 0,
        p: '10px',
        color: theme.palette.common.white,
      })}
      onClick={onClick}
    >
      <CloseIcon
        sx={{
          filter: 'drop-shadow(1px 1px 2px rgb(0 0 0 / 0.6))',
        }}
      />
    </Box>
  </Grid>
)

export const User = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        pt: 2,
      }}
    >
      <Stack spacing={1}>
        <Typography level="h4">学生劳动实践学时认定</Typography>

        <Typography level="h5">志愿服务类</Typography>

        <Alert color="info">
          <Stack spacing={1}>
            <Typography>志愿服务类学时认定说明</Typography>
            <Typography level="body2">
              参加学院组织的勤工助学岗位、学生助理岗位并积极完成工作者，按每学期可申报
              5 个学时（需勤工岗位部门认定）；在校期间参与志愿服务，志愿服务时长
              2 小时计劳动实践 1 学时（志愿服务工作，
              按所在服务单位开具的加盖部门公章证明为参考，由院团委核定为准，10
              学时封顶）。
            </Typography>
          </Stack>
        </Alert>

        <Card>
          <Stack spacing={1}>
            <Stack
              direction="row-reverse"
              sx={{
                mb: -2,
              }}
            >
              <IconButton size="sm" color="danger">
                <RemoveIcon />
              </IconButton>
            </Stack>

            <TextField label="事项" />
            <TextField
              label="学时"
              type="number"
              sx={{
                width: 0o120,
              }}
            />
            <Typography level="body2">证明材料</Typography>
            <Grid container columns={3} spacing={1}>
              {[1, 2].map((i) => (
                <ImgItem key={i} />
              ))}
              <Grid xs={1}>
                <UploadButton />
              </Grid>
            </Grid>
          </Stack>
        </Card>

        <Button variant="soft" startDecorator={<AddIcon />} color="success">
          添加项目
        </Button>

        <Alert startDecorator={<ErrorIcon />} color="danger">
          总学时不得超过 10 小时
        </Alert>

        <Stack direction="row">
          <Button startDecorator={<KeyboardArrowLeft />} variant="soft">
            上一页
          </Button>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              flex: 1,
            }}
          >
            <Typography color="neutral">1 / 3</Typography>
          </Stack>
          <Button endDecorator={<KeyboardArrowRight />}>下一页</Button>
        </Stack>
      </Stack>
    </Container>
  )
}
