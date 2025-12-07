# 时间日期API（jdk8+）

Java 8 引入了基于**JSR-310**的`java.time`包，解决了旧版的所有问题：**不可变对象**（线程安全）、**API 清晰**、**时区支持完善**。

## 核心类详解

#### 1. `LocalDate`：本地日期（无时间、无时区）

表示**年 - 月 - 日**（如 2025-12-03），适用于仅关注日期的场景（生日、节假日）。

常用方法：

- `now()`：获取当前日期。
- `of(int year, int month, int day)`：指定日期创建实例。
- `plusDays(long days)`/`minusMonths(long months)`：增减日期（返回新实例）。
- `getYear()`/`getMonthValue()`/`getDayOfMonth()`：获取字段。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
        //获取当前日期
        LocalDate today=LocalDate.now();
        System.out.println("今天的日期是："+today);
        //增减日期，返回一个新的实例
        LocalDate nextday=today.plusDays(1);
        System.out.println("明天的日期是："+nextday);
        //指定日期
        LocalDate someday=LocalDate.of(2020,1,1);
        //获取字段
        System.out.println("今天是本月的第几天："+today.getDayOfMonth());
    }
}
```

#### 2. `LocalTime`：本地时间（无日期、无时区）

表示**时：分: 秒**（如 10:30:00），适用于仅关注时间的场景

常用方法：`now()`、`of(int hour, int minute)`、`plusHours(long hours)`等。与`LocalDate`差不多

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	//获取当前时间
        LocalTime nowtime=LocalTime.now();
        System.out.println("当前时间是："+nowtime);
        //增减时间
        LocalTime newtime=nowtime.plusHours(2);
        System.out.println("两小时后的时间是："+newtime);
        //设置时间
        LocalTime settime=LocalTime.of(14,30,0);
        System.out.println("设置的时间是："+settime);
    }
}  
```

#### 3. `LocalDateTime`：本地日期时间（无时区）

组合`LocalDate`和`LocalTime`，表示**年 - 月 - 日 时：分: 秒**（如 2025-12-03 10:30:00），适用于无需时区的场景。

常用方法：`now()`、`of(LocalDate date, LocalTime time)`、`format(DateTimeFormatter)`等。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	//获取当前日期和时间
        LocalDateTime nowdatetime=LocalDateTime.now();
        System.out.println("当前日期和时间是："+nowdatetime);
        //设置日期和时间
        LocalDateTime setdatetime=LocalDateTime.of(2023,6,15,10,0,0);
        System.out.println("设置的日期和时间是："+setdatetime);
        //format
        DateTimeFormatter fmt=DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String strdatetime=nowdatetime.format(fmt);
        System.out.println("格式化后的日期和时间是："+strdatetime);
    }
}  
```

这里需要特别说明一下`format`方法,该方法可以把日期/时间对象按照指定的格式化器转为字符串

#### 4. `ZonedDateTime`：带时区的日期时间

表示**特定时区的日期时间**（如 2025-12-03 10:30:00+08:00 [Asia/Shanghai]），解决跨时区问题。依赖`ZoneId`（时区标识，如`Asia/Shanghai`、`UTC`）。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	ZoneId shanghaiZone=ZoneId.of("Asia/Shanghai");
        ZonedDateTime shanghaiTime=ZonedDateTime.now(shanghaiZone);
        System.out.println("上海的当前日期和时间是："+shanghaiTime);
        ZonedDateTime utcTime = ZonedDateTime.now(ZoneId.of("UTC")); // UTC时间
        System.out.println("UTC的当前日期和时间是：" + utcTime);
    }
}  
```

#### 5. `Instant`：时间戳（UTC）

表示**UTC 时间戳**（精确到纳秒），常用于记录事件发生的绝对时间。

可与旧版的`Date`互转：`Date.from(instant)`、`date.toInstant()`。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	Instant nowInstant=Instant.now();//等同于UTC时间
        System.out.println("当前的时间戳是："+nowInstant);
        //从 UTC 1970-01-01 00:00:00 开始的毫秒数
        long nowMillis=nowInstant.toEpochMilli();
        System.out.println("当前的时间戳（毫秒）是："+nowMillis);
    }
}  
```

#### 6. `Duration`：时间间隔（时分秒）

表示**两个时间点之间的间隔**（精确到秒 / 毫秒），适用于计算时间差（如程序运行耗时）。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	LocalTime now=LocalTime.now();
        LocalTime nexttime=now.plusHours(1).plusMinutes(30);
        Duration duration=Duration.between(now,nexttime);
        System.out.println("两个时间的间隔是："+duration.toMinutes()+"分钟");
    }
}  
```

#### 7. `Period`：日期间隔（年月日）

表示**两个日期之间的间隔**（精确到年 / 月 / 日），适用于计算日期差（如年龄）。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	LocalDate birth = LocalDate.of(2000, 1, 1);
        LocalDate Today = LocalDate.now();
        Period period = Period.between(birth, Today);
        System.out.println("相隔年份为"+period.getYears()); // 25年（2025-2000）

    }
}  
```

#### 8. `DateTimeFormatter`：格式化与解析

替代`SimpleDateFormat`，**线程安全**，支持格式化（对象→字符串）和解析（字符串→对象）。

常用模式：`yyyy-MM-dd HH:mm:ss`、`yyyy年MM月dd日`等。

```java
import java.time.*;
public class Data_time_demo {
    public static void main(String[] args) {
    	 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 格式化：LocalDateTime → 字符串
        LocalDateTime nowTime = LocalDateTime.now();
        String str = nowTime.format(formatter); // 2025-12-03 10:30:00
        System.out.println(str);
        // 解析：字符串 → LocalDateTime
        LocalDateTime parsed = LocalDateTime.parse("2025-12-03 10:30:00", formatter);
        System.out.println(parsed);
    }
}  
```

实际开发中，应优先使用新版 API 处理时间日期需求。