import _root_.io.vertx.scala.build.{VertxModule, VertxProject}

import sbt._
import sbt.Keys._

object TinyValidator4Build extends VertxProject {
  val module = VertxModule(
    "com.campudus",
    "vertx-tiny-validator4",
    "1.0.0",
    "tables into sheets",
    Some("2.11.6"),
    Seq("2.10.5", "2.11.6"))
    
  override lazy val customSettings = Seq(
    unmanagedResourceDirectories in Compile += { baseDirectory.value / "src/main/javascript" },
    
    libraryDependencies ++= Seq(
      "io.vertx" % "testtools" % "2.0.3-final" % "test",
      "org.hamcrest" % "hamcrest-library" % "1.3" % "test",
      "com.novocode" % "junit-interface" % "0.11" % "test"
    )
  )
}