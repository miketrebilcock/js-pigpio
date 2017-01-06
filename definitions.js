/**
 * Translated from https://github.com/joan2937/pigpio/blob/master/pigpio.h
 */

/*DEF_S Socket Command Codes*/

const PI_CMD_MODES =0;
const PI_CMD_MODEG =1;
const PI_CMD_PUD   =2;
const PI_CMD_READ  =3;
const PI_CMD_WRITE =4;
const PI_CMD_PWM   =5;
const PI_CMD_PRS   =6;
const PI_CMD_PFS   =7;
const PI_CMD_SERVO =8;
const PI_CMD_WDOG  =9;
const PI_CMD_BR1  =10;
const PI_CMD_BR2  =11;
const PI_CMD_BC1  =12;
const PI_CMD_BC2  =13;
const PI_CMD_BS1  =14;
const PI_CMD_BS2  =15;
const PI_CMD_TICK =16;
const PI_CMD_HWVER=17;
const PI_CMD_NO   =18;
const PI_CMD_NB   =19;
const PI_CMD_NP   =20;
const PI_CMD_NC   =21;
const PI_CMD_PRG  =22;
const PI_CMD_PFG  =23;
const PI_CMD_PRRG =24;
const PI_CMD_HELP =25;
const PI_CMD_PIGPV=26;
const PI_CMD_WVCLR=27;
const PI_CMD_WVAG =28;
const PI_CMD_WVAS =29;
const PI_CMD_WVGO =30;
const PI_CMD_WVGOR=31;
const PI_CMD_WVBSY=32;
const PI_CMD_WVHLT=33;
const PI_CMD_WVSM =34;
const PI_CMD_WVSP =35;
const PI_CMD_WVSC =36;
const PI_CMD_TRIG =37;
const PI_CMD_PROC =38;
const PI_CMD_PROCD=39;
const PI_CMD_PROCR=40;
const PI_CMD_PROCS=41;
const PI_CMD_SLRO =42;
const PI_CMD_SLR  =43;
const PI_CMD_SLRC =44;
const PI_CMD_PROCP=45;
const PI_CMD_MICS =46;
const PI_CMD_MILS =47;
const PI_CMD_PARSE=48;
const PI_CMD_WVCRE=49;
const PI_CMD_WVDEL=50;
const PI_CMD_WVTX =51;
const PI_CMD_WVTXR=52;
const PI_CMD_WVNEW=53;

const PI_CMD_I2CO =54;
const PI_CMD_I2CC =55;
const PI_CMD_I2CRD=56;
const PI_CMD_I2CWD=57;
const PI_CMD_I2CWQ=58;
const PI_CMD_I2CRS=59;
const PI_CMD_I2CWS=60;
const PI_CMD_I2CRB=61;
const PI_CMD_I2CWB=62;
const PI_CMD_I2CRW=63;
const PI_CMD_I2CWW=64;
const PI_CMD_I2CRK=65;
const PI_CMD_I2CWK=66;
const PI_CMD_I2CRI=67;
const PI_CMD_I2CWI=68;
const PI_CMD_I2CPC=69;
const PI_CMD_I2CPK=70;

const PI_CMD_SPIO =71;
const PI_CMD_SPIC =72;
const PI_CMD_SPIR =73;
const PI_CMD_SPIW =74;
const PI_CMD_SPIX =75;

const PI_CMD_SERO =76;
const PI_CMD_SERC =77;
const PI_CMD_SERRB=78;
const PI_CMD_SERWB=79;
const PI_CMD_SERR =80;
const PI_CMD_SERW =81;
const PI_CMD_SERDA=82;

const PI_CMD_GDC  =83;
const PI_CMD_GPW  =84;

const PI_CMD_HC   =85;
const PI_CMD_HP   =86;

const PI_CMD_CF1  =87;
const PI_CMD_CF2  =88;

const PI_CMD_BI2CC=89;
const PI_CMD_BI2CO=90;
const PI_CMD_BI2CZ=91;

const PI_CMD_I2CZ =92;

const PI_CMD_WVCHA=93;

const PI_CMD_SLRI =94;

const PI_CMD_CGI  =95;
const PI_CMD_CSI  =96;

const PI_CMD_FG   =97;
const PI_CMD_FN   =98;

const PI_CMD_NOIB =99;

const PI_CMD_WVTXM=100;
const PI_CMD_WVTAT=101;

const PI_CMD_PADS =102;
const PI_CMD_PADG =103;

const PI_CMD_FO   =104;
const PI_CMD_FC   =105;
const PI_CMD_FR   =106;
const PI_CMD_FW   =107;
const PI_CMD_FS   =108;
const PI_CMD_FL   =109;

const PI_CMD_SHELL=110;

const PI_CMD_BSPIC=111;
const PI_CMD_BSPIO=112;
const PI_CMD_BSPIX=113;

const PI_CMD_BSCX =114;

const PI_CMD_EVM  =115;
const PI_CMD_EVT  =116;

/*DEF_S Error Codes*/
const PI_INIT_FAILED       =-1; // gpioInitialise failed
const PI_BAD_USER_GPIO     =-2; // GPIO not 0-31
const PI_BAD_GPIO          =-3; // GPIO not 0-53
const PI_BAD_MODE          =-4; // mode not 0-7
const PI_BAD_LEVEL         =-5; // level not 0-1
const PI_BAD_PUD           =-6; // pud not 0-2
const PI_BAD_PULSEWIDTH    =-7; // pulsewidth not 0 or 500-2500
const PI_BAD_DUTYCYCLE     =-8; // dutycycle outside set range
const PI_BAD_TIMER         =-9; // timer not 0-9
const PI_BAD_MS           =-10; // ms not 10-60000
const PI_BAD_TIMETYPE     =-11; // timetype not 0-1
const PI_BAD_SECONDS      =-12; // seconds < 0
const PI_BAD_MICROS       =-13; // micros not 0-999999
const PI_TIMER_FAILED     =-14; // gpioSetTimerFunc failed
const PI_BAD_WDOG_TIMEOUT =-15; // timeout not 0-60000
const PI_NO_ALERT_FUNC    =-16; // DEPRECATED
const PI_BAD_CLK_PERIPH   =-17; // clock peripheral not 0-1
const PI_BAD_CLK_SOURCE   =-18; // DEPRECATED
const PI_BAD_CLK_MICROS   =-19; // clock micros not 1, 2, 4, 5, 8, or 10
const PI_BAD_BUF_MILLIS   =-20; // buf millis not 100-10000
const PI_BAD_DUTYRANGE    =-21; // dutycycle range not 25-40000
const PI_BAD_DUTY_RANGE   =-21; // DEPRECATED (use PI_BAD_DUTYRANGE)
const PI_BAD_SIGNUM       =-22; // signum not 0-63
const PI_BAD_PATHNAME     =-23; // can't open pathname
const PI_NO_HANDLE        =-24; // no handle available
const PI_BAD_HANDLE       =-25; // unknown handle
const PI_BAD_IF_FLAGS     =-26; // ifFlags > 3
const PI_BAD_CHANNEL      =-27; // DMA channel not 0-14
const PI_BAD_PRIM_CHANNEL =-27; // DMA primary channel not 0-14
const PI_BAD_SOCKET_PORT  =-28; // socket port not 1024-32000
const PI_BAD_FIFO_COMMAND =-29; // unrecognized fifo command
const PI_BAD_SECO_CHANNEL =-30; // DMA secondary channel not 0-6
const PI_NOT_INITIALISED  =-31; // function called before gpioInitialise
const PI_INITIALISED      =-32; // function called after gpioInitialise
const PI_BAD_WAVE_MODE    =-33; // waveform mode not 0-3
const PI_BAD_CFG_INTERNAL =-34; // bad parameter in gpioCfgInternals call
const PI_BAD_WAVE_BAUD    =-35; // baud rate not 50-250K(RX)/50-1M(TX)
const PI_TOO_MANY_PULSES  =-36; // waveform has too many pulses
const PI_TOO_MANY_CHARS   =-37; // waveform has too many chars
const PI_NOT_SERIAL_GPIO  =-38; // no bit bang serial read on GPIO
const PI_BAD_SERIAL_STRUC =-39; // bad (null) serial structure parameter
const PI_BAD_SERIAL_BUF   =-40; // bad (null) serial buf parameter
const PI_NOT_PERMITTED    =-41; // GPIO operation not permitted
const PI_SOME_PERMITTED   =-42; // one or more GPIO not permitted
const PI_BAD_WVSC_COMMND  =-43; // bad WVSC subcommand
const PI_BAD_WVSM_COMMND  =-44; // bad WVSM subcommand
const PI_BAD_WVSP_COMMND  =-45; // bad WVSP subcommand
const PI_BAD_PULSELEN     =-46; // trigger pulse length not 1-100
const PI_BAD_SCRIPT       =-47; // invalid script
const PI_BAD_SCRIPT_ID    =-48; // unknown script id
const PI_BAD_SER_OFFSET   =-49; // add serial data offset > 30 minutes
const PI_GPIO_IN_USE      =-50; // GPIO already in use
const PI_BAD_SERIAL_COUNT =-51; // must read at least a byte at a time
const PI_BAD_PARAM_NUM    =-52; // script parameter id not 0-9
const PI_DUP_TAG          =-53; // script has duplicate tag
const PI_TOO_MANY_TAGS    =-54; // script has too many tags
const PI_BAD_SCRIPT_CMD   =-55; // illegal script command
const PI_BAD_VAR_NUM      =-56; // script variable id not 0-149
const PI_NO_SCRIPT_ROOM   =-57; // no more room for scripts
const PI_NO_MEMORY        =-58; // can't allocate temporary memory
const PI_SOCK_READ_FAILED =-59; // socket read failed
const PI_SOCK_WRIT_FAILED =-60; // socket write failed
const PI_TOO_MANY_PARAM   =-61; // too many script parameters (> 10)
const PI_NOT_HALTED       =-62; // DEPRECATED
const PI_SCRIPT_NOT_READY =-62; // script initialising
const PI_BAD_TAG          =-63; // script has unresolved tag
const PI_BAD_MICS_DELAY   =-64; // bad MICS delay (too large)
const PI_BAD_MILS_DELAY   =-65; // bad MILS delay (too large)
const PI_BAD_WAVE_ID      =-66; // non existent wave id
const PI_TOO_MANY_CBS     =-67; // No more CBs for waveform
const PI_TOO_MANY_OOL     =-68; // No more OOL for waveform
const PI_EMPTY_WAVEFORM   =-69; // attempt to create an empty waveform
const PI_NO_WAVEFORM_ID   =-70; // no more waveforms
const PI_I2C_OPEN_FAILED  =-71; // can't open I2C device
const PI_SER_OPEN_FAILED  =-72; // can't open serial device
const PI_SPI_OPEN_FAILED  =-73; // can't open SPI device
const PI_BAD_I2C_BUS      =-74; // bad I2C bus
const PI_BAD_I2C_ADDR     =-75; // bad I2C address
const PI_BAD_SPI_CHANNEL  =-76; // bad SPI channel
const PI_BAD_FLAGS        =-77; // bad i2c/spi/ser open flags
const PI_BAD_SPI_SPEED    =-78; // bad SPI speed
const PI_BAD_SER_DEVICE   =-79; // bad serial device name
const PI_BAD_SER_SPEED    =-80; // bad serial baud rate
const PI_BAD_PARAM        =-81; // bad i2c/spi/ser parameter
const PI_I2C_WRITE_FAILED =-82; // i2c write failed
const PI_I2C_READ_FAILED  =-83; // i2c read failed
const PI_BAD_SPI_COUNT    =-84; // bad SPI count
const PI_SER_WRITE_FAILED =-85; // ser write failed
const PI_SER_READ_FAILED  =-86; // ser read failed
const PI_SER_READ_NO_DATA =-87; // ser read no data available
const PI_UNKNOWN_COMMAND  =-88; // unknown command
const PI_SPI_XFER_FAILED  =-89; // spi xfer/read/write failed
const PI_BAD_POINTER      =-90; // bad (NULL) pointer
const PI_NO_AUX_SPI       =-91; // no auxiliary SPI on Pi A or B
const PI_NOT_PWM_GPIO     =-92; // GPIO is not in use for PWM
const PI_NOT_SERVO_GPIO   =-93; // GPIO is not in use for servo pulses
const PI_NOT_HCLK_GPIO    =-94; // GPIO has no hardware clock
const PI_NOT_HPWM_GPIO    =-95; // GPIO has no hardware PWM
const PI_BAD_HPWM_FREQ    =-96; // hardware PWM frequency not 1-125M
const PI_BAD_HPWM_DUTY    =-97; // hardware PWM dutycycle not 0-1M
const PI_BAD_HCLK_FREQ    =-98; // hardware clock frequency not 4689-250M
const PI_BAD_HCLK_PASS    =-99; // need password to use hardware clock 1
const PI_HPWM_ILLEGAL    =-100; // illegal, PWM in use for main clock
const PI_BAD_DATABITS    =-101; // serial data bits not 1-32
const PI_BAD_STOPBITS    =-102; // serial (half) stop bits not 2-8
const PI_MSG_TOOBIG      =-103; // socket/pipe message too big
const PI_BAD_MALLOC_MODE =-104; // bad memory allocation mode
const PI_TOO_MANY_SEGS   =-105; // too many I2C transaction segments
const PI_BAD_I2C_SEG     =-106; // an I2C transaction segment failed
const PI_BAD_SMBUS_CMD   =-107; // SMBus command not supported by driver
const PI_NOT_I2C_GPIO    =-108; // no bit bang I2C in progress on GPIO
const PI_BAD_I2C_WLEN    =-109; // bad I2C write length
const PI_BAD_I2C_RLEN    =-110; // bad I2C read length
const PI_BAD_I2C_CMD     =-111; // bad I2C command
const PI_BAD_I2C_BAUD    =-112; // bad I2C baud rate, not 50-500k
const PI_CHAIN_LOOP_CNT  =-113; // bad chain loop count
const PI_BAD_CHAIN_LOOP  =-114; // empty chain loop
const PI_CHAIN_COUNTER   =-115; // too many chain counters
const PI_BAD_CHAIN_CMD   =-116; // bad chain command
const PI_BAD_CHAIN_DELAY =-117; // bad chain delay micros
const PI_CHAIN_NESTING   =-118; // chain counters nested too deeply
const PI_CHAIN_TOO_BIG   =-119; // chain is too long
const PI_DEPRECATED      =-120; // deprecated function removed
const PI_BAD_SER_INVERT  =-121; // bit bang serial invert not 0 or 1
const PI_BAD_EDGE        =-122; // bad ISR edge value, not 0-2
const PI_BAD_ISR_INIT    =-123; // bad ISR initialisation
const PI_BAD_FOREVER     =-124; // loop forever must be last command
const PI_BAD_FILTER      =-125; // bad filter parameter
const PI_BAD_PAD         =-126; // bad pad number
const PI_BAD_STRENGTH    =-127; // bad pad drive strength
const PI_FIL_OPEN_FAILED =-128; // file open failed
const PI_BAD_FILE_MODE   =-129; // bad file mode
const PI_BAD_FILE_FLAG   =-130; // bad file flag
const PI_BAD_FILE_READ   =-131; // bad file read
const PI_BAD_FILE_WRITE  =-132; // bad file write
const PI_FILE_NOT_ROPEN  =-133; // file not open for read
const PI_FILE_NOT_WOPEN  =-134; // file not open for write
const PI_BAD_FILE_SEEK   =-135; // bad file seek
const PI_NO_FILE_MATCH   =-136; // no files match pattern
const PI_NO_FILE_ACCESS  =-137; // no permission to access file
const PI_FILE_IS_A_DIR   =-138; // file is a directory
const PI_BAD_SHELL_STATUS=-139; // bad shell return status
const PI_BAD_SCRIPT_NAME =-140; // bad script name
const PI_BAD_SPI_BAUD    =-141; // bad SPI baud rate, not 50-500k
const PI_NOT_SPI_GPIO    =-142; // no bit bang SPI in progress on GPIO
const PI_BAD_EVENT_ID    =-143; // bad event id

const PI_PIGIF_ERR_0    =-2000;
const PI_PIGIF_ERR_99   =-2099;

const PI_CUSTOM_ERR_0   =-3000;
const PI_CUSTOM_ERR_999 =-3999;