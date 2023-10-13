Feature: Convert EZDrummer 2 track to General MIDI
  As a musician
  I want to convert EZDrummer 2 tracks back and forth with General MIDI
  So that I can maintain flow when copying drum tracks to MuseScore

  Scenario: BamBam should produce a valid MIDI track
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then the re-mapped track should be a valid MIDI track that others can read

  #TODO KDK: Prototype copying events without parsing anything unnecessary
  Scenario: BamBam should re-map an EZDrummer 2 track to General MIDI Percussion
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then re-mapped channel events for General MIDI Percussion notes should stay the same
    And re-mapped channel events for non-standard notes should use General MIDI Percussion notes
    And the re-mapped track should copy all other events from the original track

  @deprecated
  Scenario: BamBam should copy timing information from the original track
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then the re-mapped track should have the same resolution as the original
    And the re-mapped track should have the same tempo map as the original
    And the re-mapped track should have the same time signatures as the original
    And the re-mapped track should play the same drum pattern as the original

  @deprecated
  Scenario: BamBam should re-map an EZDrummer 2 track to General MIDI Percussion (v1)
    Given I have exported an EZDrummer 2 track from my DAW, as MIDI
    When I ask BamBam to remap that track to General MIDI Percussion
    Then non-standard notes should be changed to their equivalent in General MIDI
    And notes that are already General MIDI Percussion should stay the same
