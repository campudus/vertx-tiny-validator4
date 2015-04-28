import _root_.io.vertx.scala.build.{VertxModule, VertxProject}

import sbt._
import sbt.Keys._

object TinyValidator4Build extends VertxProject {
  val module = VertxModule(
    "com.campudus",
    "vertx-tiny-validator4",
    "1.0.0",
    "Vert.x module to validate JSON against a json-schema draft v4.",
    Some("2.11.6"),
    Seq("2.10.5", "2.11.6"))
    
  override lazy val customSettings = Seq(
    unmanagedResourceDirectories in Compile += { baseDirectory.value / "src/main/javascript" },
    
    libraryDependencies ++= Seq(
      "io.vertx" % "testtools" % "2.0.3-final" % "test",
      "org.hamcrest" % "hamcrest-library" % "1.3" % "test",
      "com.novocode" % "junit-interface" % "0.11" % "test"
    ),

    pomExtra :=
      <inceptionYear>2015</inceptionYear>
      <url>https://github.com/campudus/vertx-tiny-validator4</url>
      <licenses>
        <license>
          <name>Apache License, Version 2.0</name>
          <url>http://www.apache.org/licenses/LICENSE-2.0.html</url>
          <distribution>repo</distribution>
        </license>
      </licenses>
      <scm>
        <connection>scm:git:https://github.com/campudus/vertx-tiny-validator4.git</connection>
        <developerConnection>scm:git:ssh://git@github.com:campudus/vertx-tiny-validator4.git</developerConnection>
        <url>https://github.com/campudus/vertx-tiny-validator4</url>
      </scm>
      <developers>
        <developer>
          <id>alexvetter</id>
          <name>Alexander Vetter</name>
        </developer>
      </developers>
  )
}